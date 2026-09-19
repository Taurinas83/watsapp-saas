import { NextRequest, NextResponse } from 'next/server';
import { generateBotResponse } from '@/lib/ai-engine';
import { fetchAttendant, fetchKnowledgeItems, insertMessage } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/client';
import { initialAttendant, initialKnowledgeItems } from '@/lib/mock-data';

import { DEFAULT_ORG_ID } from '@/lib/constants';

// Log webhook events for debugging (console only, no DB dependency)
function logWebhookEvent(payload: any, result: string) {
  console.log('WEBHOOK_LOG:', JSON.stringify({
    event: payload?.event || 'unknown',
    instance: payload?.instance || 'unknown',
    result,
    timestamp: new Date().toISOString(),
    payloadKeys: Object.keys(payload || {}),
    dataKeys: Object.keys(payload?.data || {}),
  }));
}

export async function POST(req: NextRequest) {
  let rawBody = '';
  try {
    rawBody = await req.text();
    console.log('WEBHOOK RAW BODY (first 500 chars):', rawBody.slice(0, 500));

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('WEBHOOK: Failed to parse JSON body');
      return NextResponse.json({ status: 'error', message: 'Invalid JSON' }, { status: 400 });
    }

    console.log('WEBHOOK EVENT:', payload?.event, 'INSTANCE:', payload?.instance);

    const instance = payload?.instance || payload?.instanceName || 'default_org';
    const event = payload?.event || payload?.type || '';

    // Ignore connection/qrcode/status events
    if (event && (
      event.toLowerCase().includes('connection') ||
      event.toLowerCase().includes('qrcode') ||
      event.toLowerCase().includes('presence') ||
      event.toLowerCase().includes('status')
    )) {
      console.log('WEBHOOK: Ignoring event type:', event);
      return NextResponse.json({ status: 'ignored_event', event });
    }

    // Support multiple payload structures from Evolution API
    // v1: payload.data (object or array)
    // v2: payload itself contains key, message, pushName
    // MESSAGES_SET: payload.data is an array of messages
    let messages: any[] = [];

    if (event === 'MESSAGES_SET' || event === 'messages.set') {
      // MESSAGES_SET sends an array of messages
      const dataArr = Array.isArray(payload?.data) ? payload.data :
        (payload?.data?.messages ? payload.data.messages : []);
      messages = dataArr;
    } else {
      // MESSAGES_UPSERT, MESSAGES_UPDATE, etc. - single message
      const data = Array.isArray(payload?.data) ? payload.data[0] :
        (payload?.data || payload);
      messages = [data];
    }

    console.log('WEBHOOK: Processing', messages.length, 'messages from event:', event);

    let processedCount = 0;

    for (const data of messages) {
      try {
        const key = data?.key || payload?.key;
        const fromMe = key?.fromMe ?? false;

        // Ignore messages sent by bot/attendant
        if (fromMe) {
          console.log('WEBHOOK: Skipping fromMe message');
          continue;
        }

        const remoteJid = key?.remoteJid || data?.remoteJid || payload?.remoteJid || '';

        // Ignore groups, status updates, newsletters
        if (
          remoteJid.includes('@g.us') ||
          remoteJid.includes('@status') ||
          remoteJid.includes('@newsletter') ||
          remoteJid.includes('@broadcast')
        ) {
          console.log('WEBHOOK: Skipping group/status/newsletter:', remoteJid);
          continue;
        }

        const customerPhone = remoteJid ? remoteJid.split('@')[0].replace(/\D/g, '') : null;
        const customerName = data?.pushName || payload?.pushName || 'Cliente WhatsApp';

        // Extract message text from various formats
        const messageText =
          data?.message?.conversation ||
          data?.message?.extendedTextMessage?.text ||
          data?.message?.imageMessage?.caption ||
          data?.message?.videoMessage?.caption ||
          data?.message?.documentMessage?.caption ||
          data?.message?.buttonsResponseMessage?.selectedDisplayText ||
          data?.message?.listResponseMessage?.title ||
          data?.message?.templateButtonReplyMessage?.selectedDisplayText ||
          data?.messageText ||
          payload?.messageText ||
          data?.body ||
          data?.content ||
          data?.text;

        if (!messageText || !customerPhone) {
          console.log('WEBHOOK: Skipping empty payload. Phone:', customerPhone, 'Text:', !!messageText);
          continue;
        }

        console.log('WEBHOOK: Processing message from', customerPhone, ':', messageText.slice(0, 100));

        const organizationId = DEFAULT_ORG_ID;

        // 1. Fetch AI config from Supabase
        const [attendantData, knowledgeItemsData] = await Promise.all([
          fetchAttendant(organizationId).catch(() => null),
          fetchKnowledgeItems(organizationId).catch(() => [])
        ]);

        const attendant = attendantData || initialAttendant;
        const knowledgeItems = (knowledgeItemsData && knowledgeItemsData.length > 0) ? knowledgeItemsData : initialKnowledgeItems;

        // 2. Generate AI response
        const aiResult = await generateBotResponse(
          messageText,
          attendant,
          knowledgeItems,
          []
        );

        // 3. Save customer message and AI response to Supabase
        try {
          const supabase = createClient();

          // Find or create conversation
          const { data: existingConvs } = await supabase
            .from('conversations')
            .select('*')
            .eq('customer_phone', customerPhone)
            .eq('organization_id', organizationId)
            .order('created_at', { ascending: false })
            .limit(1);

          let conv = (existingConvs && existingConvs.length > 0) ? existingConvs[0] : null;

          if (!conv) {
            const { data: newConv } = await supabase
              .from('conversations')
              .insert({
                organization_id: organizationId,
                customer_name: customerName,
                customer_phone: customerPhone,
                status: 'bot_active',
                last_message: messageText,
                last_message_at: new Date().toISOString(),
                unread_count: 1
              })
              .select()
              .single();
            conv = newConv;
          } else {
            await supabase
              .from('conversations')
              .update({
                customer_name: customerName || conv.customer_name,
                last_message: messageText,
                last_message_at: new Date().toISOString(),
                unread_count: (conv.unread_count || 0) + 1
              })
              .eq('id', conv.id);
          }

          if (conv) {
            // Save customer message
            await insertMessage(conv.id, organizationId, 'customer', customerName, messageText);
            // Save bot response
            await insertMessage(conv.id, organizationId, 'bot', attendant.name, aiResult.content);
            console.log('WEBHOOK: Messages saved to Supabase for conv:', conv.id);
          }
        } catch (dbErr) {
          console.error('WEBHOOK: DB error:', dbErr);
        }

        // 4. Send AI reply back via Evolution API
        const evolutionUrl = process.env.EVOLUTION_API_URL || 'http://167.71.23.116:8080';
        const evolutionApiKey = process.env.EVOLUTION_API_KEY || 'minha_chave_saas_2026';

        if (evolutionUrl && evolutionApiKey && aiResult.content) {
          try {
            const sendRes = await fetch(`${evolutionUrl}/message/sendText/${instance}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                apikey: evolutionApiKey
              },
              body: JSON.stringify({
                number: customerPhone,
                text: aiResult.content
              }),
              signal: AbortSignal.timeout(15000) // 15s timeout for slow server
            });
            console.log('WEBHOOK: sendText response status:', sendRes.status);
          } catch (sendErr: any) {
            console.error('WEBHOOK: sendText error:', sendErr.message);
          }
        }

        processedCount++;
      } catch (msgErr) {
        console.error('WEBHOOK: Error processing individual message:', msgErr);
      }
    }

    console.log('WEBHOOK: Completed. Processed', processedCount, 'messages');

    return NextResponse.json({
      status: 'success',
      processed: processedCount,
      total: messages.length,
      event
    });
  } catch (err: any) {
    console.error('WEBHOOK FATAL ERROR:', err.message, 'Raw body:', rawBody.slice(0, 200));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Also handle GET for easy testing
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/whatsapp/webhook',
    method: 'POST required',
    timestamp: new Date().toISOString(),
  });
}
