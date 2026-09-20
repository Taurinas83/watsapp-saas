import { NextRequest, NextResponse } from 'next/server';
import { generateBotResponse } from '@/lib/ai-engine';
import { fetchAttendant, fetchKnowledgeItems, insertMessage } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/client';
import { initialAttendant, initialKnowledgeItems } from '@/lib/mock-data';
import { DEFAULT_ORG_ID } from '@/lib/constants';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — adjust these values as needed
// ─────────────────────────────────────────────────────────────────────────────

/** Maximum age of a message to be processed (in seconds). Older = historical sync, ignore. */
const MAX_MESSAGE_AGE_SECONDS = 180; // 3 minutes

/** If a conversation is closed, how many hours before we allow the bot to re-engage? */
const REOPEN_AFTER_HOURS = 24; // 24 hours without contact = treat as new conversation

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isMessageTooOld(messageTimestamp: number | undefined): boolean {
  if (!messageTimestamp) return false; // no timestamp = assume new, let other filters decide
  const msgAgeSeconds = Math.floor(Date.now() / 1000) - messageTimestamp;
  return msgAgeSeconds > MAX_MESSAGE_AGE_SECONDS;
}

function isBlockedJid(remoteJid: string): boolean {
  return (
    remoteJid.includes('@g.us') ||        // WhatsApp groups
    remoteJid.includes('@status') ||      // Status broadcasts
    remoteJid.includes('@newsletter') ||  // WhatsApp newsletters
    remoteJid.includes('@broadcast') ||   // Old-style broadcast lists
    remoteJid.includes('@lid')            // Anonymous/linked devices
  );
}

function extractMessageText(data: any, payload: any): string | null {
  return (
    data?.message?.conversation ||
    data?.message?.extendedTextMessage?.text ||
    data?.message?.imageMessage?.caption ||
    data?.message?.videoMessage?.caption ||
    data?.message?.documentMessage?.caption ||
    data?.message?.audioMessage?.caption ||
    data?.message?.buttonsResponseMessage?.selectedDisplayText ||
    data?.message?.listResponseMessage?.title ||
    data?.message?.templateButtonReplyMessage?.selectedDisplayText ||
    data?.messageText ||
    payload?.messageText ||
    data?.body ||
    data?.content ||
    data?.text ||
    null
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let rawBody = '';
  try {
    rawBody = await req.text();

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('WEBHOOK: Failed to parse JSON body');
      return NextResponse.json({ status: 'error', message: 'Invalid JSON' }, { status: 400 });
    }

    const instance = payload?.instance || payload?.instanceName || 'default_org';
    const event = (payload?.event || payload?.type || '').toUpperCase();

    console.log(`WEBHOOK EVENT: ${event} | INSTANCE: ${instance}`);

    // ── RULE 1: Ignore non-message events ─────────────────────────────────
    const ignoredEvents = [
      'MESSAGES_SET',      // Historical sync on connect — NEVER respond to these
      'MESSAGES_UPDATE',   // Read receipts, delivery status — not new messages
      'CONNECTION_UPDATE', // Connection state changes
      'QRCODE_UPDATED',    // QR code refreshed
      'PRESENCE_UPDATE',   // Online/offline/typing
      'CHATS_SET',         // Chat list sync
      'CHATS_UPDATE',      // Chat metadata update
      'CONTACTS_SET',      // Contact list sync
      'CONTACTS_UPDATE',   // Contact update
      'GROUPS_UPSERT',     // Group created/updated
      'GROUPS_UPDATE',     // Group metadata changed
      'GROUP_PARTICIPANTS_UPDATE', // Member join/leave
      'SEND_MESSAGE',      // Confirmation of our own send — ignore
      'CALL',              // Incoming call notification
    ];

    if (ignoredEvents.includes(event)) {
      console.log(`WEBHOOK: Ignoring event "${event}" (not a new inbound message)`);
      return NextResponse.json({ status: 'ignored', reason: `event_${event.toLowerCase()}`, event });
    }

    // ── Only process MESSAGES_UPSERT from here ─────────────────────────────
    if (event !== 'MESSAGES_UPSERT' && event !== 'MESSAGES.UPSERT') {
      console.log(`WEBHOOK: Unknown event "${event}", skipping`);
      return NextResponse.json({ status: 'ignored', reason: 'unknown_event', event });
    }

    // Parse message(s) — can be array or single
    const rawData = payload?.data;
    const messages: any[] = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);

    if (messages.length === 0) {
      return NextResponse.json({ status: 'ignored', reason: 'no_messages' });
    }

    console.log(`WEBHOOK: ${messages.length} message(s) to evaluate`);

    let processedCount = 0;
    let skippedCount = 0;

    for (const data of messages) {
      try {
        const key = data?.key || payload?.key;

        // ── RULE 2: Never respond to our own messages ──────────────────────
        if (key?.fromMe === true) {
          skippedCount++;
          console.log('WEBHOOK: Skip — fromMe');
          continue;
        }

        const remoteJid: string = key?.remoteJid || data?.remoteJid || payload?.remoteJid || '';

        // ── RULE 3: Block groups, broadcasts, newsletters, status ──────────
        if (!remoteJid || isBlockedJid(remoteJid)) {
          skippedCount++;
          console.log(`WEBHOOK: Skip — blocked JID: ${remoteJid}`);
          continue;
        }

        // ── RULE 4: Ignore old messages (historical sync protection) ────────
        const msgTimestamp: number | undefined =
          data?.messageTimestamp || data?.timestamp || key?.timestamp;

        if (isMessageTooOld(msgTimestamp)) {
          skippedCount++;
          const ageSeconds = msgTimestamp ? Math.floor(Date.now() / 1000) - msgTimestamp : -1;
          console.log(`WEBHOOK: Skip — message too old (${ageSeconds}s ago)`);
          continue;
        }

        // ── RULE 5: Only process text messages ─────────────────────────────
        const messageText = extractMessageText(data, payload);
        const customerPhone = remoteJid.split('@')[0].replace(/\D/g, '') || null;

        if (!messageText || !customerPhone) {
          skippedCount++;
          console.log(`WEBHOOK: Skip — no text or phone. Phone: ${customerPhone}, hasText: ${!!messageText}`);
          continue;
        }

        const customerName = data?.pushName || payload?.pushName || 'Cliente WhatsApp';
        const organizationId = DEFAULT_ORG_ID;
        const messageId = key?.id || data?.id || null;

        console.log(`WEBHOOK: Processing message from +${customerPhone} (${customerName}): "${messageText.slice(0, 80)}"`);

        const supabase = createClient();

        // ── RULE 6: Deduplication — skip if message ID already processed ───
        if (messageId) {
          const { data: existing } = await supabase
            .from('messages')
            .select('id')
            .eq('whatsapp_message_id', messageId)
            .limit(1);

          if (existing && existing.length > 0) {
            skippedCount++;
            console.log(`WEBHOOK: Skip — duplicate message ID: ${messageId}`);
            continue;
          }
        }

        // ── RULE 7: Check conversation status ──────────────────────────────
        const { data: existingConvs } = await supabase
          .from('conversations')
          .select('*')
          .eq('customer_phone', customerPhone)
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(1);

        let conv = (existingConvs && existingConvs.length > 0) ? existingConvs[0] : null;

        // Determine if bot should respond
        let botShouldRespond = true;

        if (conv) {
          if (conv.status === 'human_active') {
            // Human attendant is handling — just save message, don't respond
            botShouldRespond = false;
            console.log(`WEBHOOK: Conv ${conv.id} is human_active — saving message only`);
          } else if (conv.status === 'closed') {
            // Conversation was closed — check cooldown
            const lastMessageAt = conv.last_message_at ? new Date(conv.last_message_at) : null;
            const hoursSinceLastContact = lastMessageAt
              ? (Date.now() - lastMessageAt.getTime()) / (1000 * 60 * 60)
              : Infinity;

            if (hoursSinceLastContact >= REOPEN_AFTER_HOURS) {
              // Re-open conversation as new bot session
              console.log(`WEBHOOK: Reopening closed conv (${hoursSinceLastContact.toFixed(1)}h since last contact)`);
              await supabase
                .from('conversations')
                .update({ status: 'bot_active', unread_count: 1 })
                .eq('id', conv.id);
              conv.status = 'bot_active';
              botShouldRespond = true;
            } else {
              // Too soon — don't auto-respond to closed conv
              botShouldRespond = false;
              console.log(`WEBHOOK: Conv ${conv.id} is closed (${hoursSinceLastContact.toFixed(1)}h ago < ${REOPEN_AFTER_HOURS}h threshold) — saving only`);
            }
          }
          // bot_active → botShouldRespond remains true

          // Update conversation
          await supabase
            .from('conversations')
            .update({
              customer_name: customerName || conv.customer_name,
              last_message: messageText,
              last_message_at: new Date().toISOString(),
              unread_count: (conv.unread_count || 0) + 1,
            })
            .eq('id', conv.id);

        } else {
          // New conversation — create it
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({
              organization_id: organizationId,
              customer_name: customerName,
              customer_phone: customerPhone,
              status: 'bot_active',
              last_message: messageText,
              last_message_at: new Date().toISOString(),
              unread_count: 1,
            })
            .select()
            .single();
          conv = newConv;
          console.log(`WEBHOOK: New conversation created: ${conv?.id}`);
        }

        if (!conv) {
          console.error('WEBHOOK: Failed to get/create conversation');
          continue;
        }

        // Save customer message (with dedup ID)
        await supabase.from('messages').insert({
          conversation_id: conv.id,
          organization_id: organizationId,
          sender_type: 'customer',
          sender_name: customerName,
          content: messageText,
          whatsapp_message_id: messageId || null,
          created_at: new Date().toISOString(),
        });

        if (!botShouldRespond) {
          console.log(`WEBHOOK: Message saved, bot response suppressed for conv ${conv.id}`);
          processedCount++;
          continue;
        }

        // ── Generate AI response ────────────────────────────────────────────
        const [attendantData, knowledgeItemsData] = await Promise.all([
          fetchAttendant(organizationId).catch(() => null),
          fetchKnowledgeItems(organizationId).catch(() => []),
        ]);

        const attendant = attendantData || initialAttendant;
        const knowledgeItems = (knowledgeItemsData && knowledgeItemsData.length > 0)
          ? knowledgeItemsData
          : initialKnowledgeItems;

        const aiResult = await generateBotResponse(messageText, attendant, knowledgeItems, []);

        // Save bot response
        await supabase.from('messages').insert({
          conversation_id: conv.id,
          organization_id: organizationId,
          sender_type: 'bot',
          sender_name: attendant.name,
          content: aiResult.content,
          created_at: new Date().toISOString(),
        });

        // ── Send reply via Evolution API ────────────────────────────────────
        const evolutionUrl = process.env.EVOLUTION_API_URL;
        const evolutionApiKey = process.env.EVOLUTION_API_KEY;

        if (evolutionUrl && evolutionApiKey && aiResult.content) {
          try {
            const sendRes = await fetch(`${evolutionUrl}/message/sendText/${instance}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', apikey: evolutionApiKey },
              body: JSON.stringify({ number: customerPhone, text: aiResult.content }),
              signal: AbortSignal.timeout(15000),
            });
            console.log(`WEBHOOK: sendText → status ${sendRes.status}`);
          } catch (sendErr: any) {
            console.error('WEBHOOK: sendText failed:', sendErr.message);
          }
        }

        processedCount++;
      } catch (msgErr) {
        console.error('WEBHOOK: Error processing message:', msgErr);
      }
    }

    console.log(`WEBHOOK: Done — processed: ${processedCount}, skipped: ${skippedCount}`);

    return NextResponse.json({
      status: 'success',
      processed: processedCount,
      skipped: skippedCount,
      total: messages.length,
      event,
    });

  } catch (err: any) {
    console.error('WEBHOOK FATAL ERROR:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/whatsapp/webhook',
    rules: {
      ignoredEvents: ['MESSAGES_SET', 'MESSAGES_UPDATE', 'CONNECTION_UPDATE', '...'],
      maxMessageAgeSeconds: MAX_MESSAGE_AGE_SECONDS,
      reopenAfterHours: REOPEN_AFTER_HOURS,
      blockedJids: ['@g.us (groups)', '@status', '@newsletter', '@broadcast'],
    },
    timestamp: new Date().toISOString(),
  });
}
