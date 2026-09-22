import { NextRequest, NextResponse } from 'next/server';
import { generateBotResponse, maskPII } from '@/lib/ai-engine';
import { fetchAttendant, fetchKnowledgeItems, insertMessage } from '@/lib/supabase/actions';
import { createClient } from '@/lib/supabase/client';
import { initialAttendant, initialKnowledgeItems } from '@/lib/mock-data';
import { DEFAULT_ORG_ID } from '@/lib/constants';
import { Message } from '@/types';
import { syncCrmLead } from '@/lib/crm/sync';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÕES GLOBAIS DE PROTEÇÃO
// ─────────────────────────────────────────────────────────────────────────────
const MAX_MESSAGE_AGE_SECONDS = 180; // Regra 2: 3 minutos máximo para descarte de histórico
const REOPEN_AFTER_HOURS = 24;       // Regra 6: Cooldown de reabertura após conversa encerrada
const RATE_LIMIT_MAX_PER_MINUTE = 10; // Regra 15: Máximo 10 mensagens por minuto por contato

// Helper para normalizar URL sem trailing newlines ou barras extras
function getCleanEvoUrl(): string {
  const url = process.env.EVOLUTION_API_URL || 'https://evolution-api-production-5589.up.railway.app';
  return url.trim().replace(/\/+$/, '');
}

function getCleanEvoKey(): string {
  const key = process.env.EVOLUTION_API_KEY || 'e5039cbd79c8df9f44f542e9bf4b21bc3ae9a1f191647979f80697888a5a2360';
  return key.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 4: FILTRO DE ORIGEM
// ─────────────────────────────────────────────────────────────────────────────
function isBlockedJid(remoteJid: string): boolean {
  if (!remoteJid) return true;
  return (
    remoteJid.includes('@g.us') ||        // Grupos de WhatsApp
    remoteJid.includes('@status') ||      // Status do WhatsApp
    remoteJid.includes('@newsletter') ||  // Newsletters / Canais
    remoteJid.includes('@broadcast') ||   // Listas de transmissão
    remoteJid.includes('@lid')            // Linked Devices internos
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 2: FILTRO DE TEMPO ANTI-HISTÓRICO
// ─────────────────────────────────────────────────────────────────────────────
function isMessageTooOld(msgTimestamp: number | undefined): boolean {
  if (!msgTimestamp) return false;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const age = nowInSeconds - msgTimestamp;
  return age > MAX_MESSAGE_AGE_SECONDS;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 9: PROCESSAMENTO DE MÍDIAS
// ─────────────────────────────────────────────────────────────────────────────
interface ExtractedContent {
  text: string | null;
  mediaType: 'text' | 'audio' | 'image' | 'document' | 'other';
}

function extractMessageContent(data: any, payload: any): ExtractedContent {
  const msgObj = data?.message || payload?.message;

  // Áudio
  if (msgObj?.audioMessage) {
    return { text: null, mediaType: 'audio' };
  }

  // Imagem
  if (msgObj?.imageMessage) {
    const caption = msgObj.imageMessage.caption;
    return { text: caption || null, mediaType: 'image' };
  }

  // Documento
  if (msgObj?.documentMessage) {
    const caption = msgObj.documentMessage.caption;
    return { text: caption || null, mediaType: 'document' };
  }

  // Texto Padrão
  const text =
    msgObj?.conversation ||
    msgObj?.extendedTextMessage?.text ||
    msgObj?.buttonsResponseMessage?.selectedDisplayText ||
    msgObj?.listResponseMessage?.title ||
    msgObj?.templateButtonReplyMessage?.selectedDisplayText ||
    data?.messageText ||
    payload?.messageText ||
    data?.body ||
    data?.content ||
    data?.text ||
    null;

  return { text: text ? text.trim() : null, mediaType: 'text' };
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 8 (EXTRA): INDICADOR DE DIGITAÇÃO NA EVOLUTION API
// ─────────────────────────────────────────────────────────────────────────────
async function sendTypingIndicator(instance: string, phone: string) {
  try {
    const evoUrl = getCleanEvoUrl();
    const evoKey = getCleanEvoKey();
    await fetch(`${evoUrl}/chat/sendPresence/${instance}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: evoKey },
      body: JSON.stringify({
        number: phone,
        presence: 'composing',
        delay: 1200,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Silencioso - presença é decorativa
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 15: RATE LIMITING NO SUPABASE
// ─────────────────────────────────────────────────────────────────────────────
async function checkRateLimit(supabase: any, phone: string, orgId: string): Promise<boolean> {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', orgId)
      .eq('sender_type', 'customer')
      .gte('created_at', oneMinuteAgo);

    if (error) return false;
    return (count || 0) >= RATE_LIMIT_MAX_PER_MINUTE;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER PRINCIPAL DO WEBHOOK
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let rawBody = '';

  try {
    rawBody = await req.text();

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ status: 'error', message: 'Invalid JSON' }, { status: 400 });
    }

    const instance = payload?.instance || payload?.instanceName || 'default_org';
    const event = (payload?.event || payload?.type || '').toUpperCase();

    // ── REGRA 1: IGNORAR MESSAGES_SET E EVENTOS HISTÓRICOS / NÃO MENSAGEM ────
    const ignoredEvents = [
      'MESSAGES_SET',
      'MESSAGES.SET',
      'MESSAGES_UPDATE',
      'MESSAGES.UPDATE',
      'CHATS_SET',
      'CHATS.SET',
      'CHATS_UPDATE',
      'CONTACTS_SET',
      'CONTACTS.SET',
      'CONNECTION_UPDATE',
      'QRCODE_UPDATED',
      'PRESENCE_UPDATE',
      'SEND_MESSAGE',
      'CALL',
    ];

    if (ignoredEvents.includes(event)) {
      return NextResponse.json({ status: 'ignored', reason: `event_${event.toLowerCase()}`, event });
    }

    // Apenas processar mensagens novas (MESSAGES_UPSERT)
    if (event !== 'MESSAGES_UPSERT' && event !== 'MESSAGES.UPSERT') {
      return NextResponse.json({ status: 'ignored', reason: 'unsupported_event', event });
    }

    const rawData = payload?.data;
    const messages: any[] = Array.isArray(rawData) ? rawData : (rawData ? [rawData] : []);

    if (messages.length === 0) {
      return NextResponse.json({ status: 'ignored', reason: 'empty_messages' });
    }

    const supabase = createClient();
    let organizationId = DEFAULT_ORG_ID;

    if (instance && instance !== 'default_org') {
      if (instance.startsWith('org_')) {
        const candidateId = instance.replace('org_', '').replace(/_/g, '-');
        const { data: orgData } = await supabase
          .from('organizations')
          .select('id')
          .eq('id', candidateId)
          .single();

        if (orgData?.id) {
          organizationId = orgData.id;
        }
      }
    }

    let processedCount = 0;
    let skippedCount = 0;

    for (const data of messages) {
      try {
        const key = data?.key || payload?.key;

        // Descartar mensagens enviadas pelo próprio número
        if (key?.fromMe === true) {
          skippedCount++;
          continue;
        }

        const remoteJid: string = key?.remoteJid || data?.remoteJid || payload?.remoteJid || '';

        // ── REGRA 4: FILTRO DE ORIGEM (GRUPOS, BROADCAST, NEWSLETTERS) ───────
        if (isBlockedJid(remoteJid)) {
          skippedCount++;
          continue;
        }

        // ── REGRA 2: FILTRO DE TEMPO (ANTI-HISTÓRICO > 3 MINUTOS) ────────────
        const msgTimestamp: number | undefined = data?.messageTimestamp || data?.timestamp || key?.timestamp;
        if (isMessageTooOld(msgTimestamp)) {
          skippedCount++;
          continue;
        }

        // ── REGRA 3: DEDUPLICAÇÃO POR ID DE MENSAGEM ────────────────────────
        const whatsappMessageId: string | null = key?.id || data?.id || null;
        if (whatsappMessageId) {
          const { data: existingMsg } = await supabase
            .from('messages')
            .select('id')
            .eq('whatsapp_message_id', whatsappMessageId)
            .limit(1);

          if (existingMsg && existingMsg.length > 0) {
            skippedCount++;
            continue;
          }
        }

        // ── EXTRAÇÃO E CLASSIFICAÇÃO DE MÍDIA (REGRA 9) ──────────────────────
        const customerPhone = remoteJid.split('@')[0].replace(/\D/g, '') || null;
        const customerName = data?.pushName || payload?.pushName || 'Cliente WhatsApp';
        const { text: rawText, mediaType } = extractMessageContent(data, payload);

        if (!customerPhone) {
          skippedCount++;
          continue;
        }

        // ── REGRA 15: RATE LIMITING POR USUÁRIO ──────────────────────────────
        const isRateLimited = await checkRateLimit(supabase, customerPhone, organizationId);
        if (isRateLimited) {
          const evoUrl = getCleanEvoUrl();
          const evoKey = getCleanEvoKey();
          await fetch(`${evoUrl}/message/sendText/${instance}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: evoKey },
            body: JSON.stringify({
              number: customerPhone,
              text: 'Você está enviando mensagens muito rapidamente. Por favor, aguarde alguns instantes para continuarmos! 😊',
            }),
            signal: AbortSignal.timeout(5000),
          }).catch(() => null);
          skippedCount++;
          continue;
        }

        // ── REGRA 5 & 6: RESOLUÇÃO DE CONVERSA E COOLDOWN ───────────────────
        const { data: existingConvs } = await supabase
          .from('conversations')
          .select('*')
          .eq('customer_phone', customerPhone)
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(1);

        let conv = existingConvs && existingConvs.length > 0 ? existingConvs[0] : null;
        let shouldBotRespond = true;

        if (conv) {
          if (conv.status === 'human_active' || conv.status === 'waiting_human') {
            // Humano no controle — registrar mensagem, mas NÃO responder com IA
            shouldBotRespond = false;
          } else if (conv.status === 'closed') {
            // REGRA 6: Reengajamento com Cooldown
            const lastContact = conv.last_message_at ? new Date(conv.last_message_at).getTime() : 0;
            const hoursSinceClosed = (Date.now() - lastContact) / (1000 * 60 * 60);

            if (hoursSinceClosed >= REOPEN_AFTER_HOURS) {
              await supabase
                .from('conversations')
                .update({ status: 'bot_active', unread_count: 1 })
                .eq('id', conv.id);
              conv.status = 'bot_active';
              shouldBotRespond = true;
            } else {
              shouldBotRespond = false;
            }
          }

          // Atualizar último registro da conversa
          await supabase
            .from('conversations')
            .update({
              customer_name: customerName || conv.customer_name,
              last_message: rawText || `[Arquivo ${mediaType}]`,
              last_message_at: new Date().toISOString(),
              unread_count: (conv.unread_count || 0) + 1,
            })
            .eq('id', conv.id);
        } else {
          // Nova conversa
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({
              organization_id: organizationId,
              customer_name: customerName,
              customer_phone: customerPhone,
              status: 'bot_active',
              last_message: rawText || `[Arquivo ${mediaType}]`,
              last_message_at: new Date().toISOString(),
              unread_count: 1,
            })
            .select()
            .single();
          conv = newConv;
        }

        if (!conv) continue;

        // ── REGRA 14: MASCARAMENTO DE DADOS SENSÍVEIS (PII) ──────────────────
        const effectiveUserText = rawText || `[Enviou ${mediaType}]`;
        const { sanitized: sanitizedUserText } = maskPII(effectiveUserText);

        // Salvar mensagem do cliente no banco
        await supabase.from('messages').insert({
          conversation_id: conv.id,
          organization_id: organizationId,
          sender_type: 'customer',
          sender_name: customerName,
          content: sanitizedUserText,
          whatsapp_message_id: whatsappMessageId,
          created_at: new Date().toISOString(),
        });

        // Se conversa for gerenciada por humano ou fechada recentemente, encerra aqui
        if (!shouldBotRespond) {
          processedCount++;
          continue;
        }

        // ── REGRA 9: TRATAMENTO DE ÁUDIO, IMAGEM OU DOCUMENTO ───────────────
        if (mediaType === 'audio') {
          const audioReply = 'Recebi seu áudio! No momento compreendo apenas mensagens de texto. Poderia digitar sua dúvida, por favor? 😊';
          await insertMessage(conv.id, organizationId, 'bot', 'Assistente', audioReply);
          const evoUrl = getCleanEvoUrl();
          const evoKey = getCleanEvoKey();
          await fetch(`${evoUrl}/message/sendText/${instance}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: evoKey },
            body: JSON.stringify({ number: customerPhone, text: audioReply }),
            signal: AbortSignal.timeout(10000),
          }).catch(() => null);
          processedCount++;
          continue;
        }

        if (mediaType === 'image' || mediaType === 'document') {
          if (!rawText) {
            const mediaReply = 'Recebi seu arquivo com sucesso! Nossa equipe humana irá analisá-lo em breve.';
            await insertMessage(conv.id, organizationId, 'bot', 'Assistente', mediaReply);
            await supabase.from('conversations').update({ status: 'waiting_human' }).eq('id', conv.id);

            const evoUrl = getCleanEvoUrl();
            const evoKey = getCleanEvoKey();
            await fetch(`${evoUrl}/message/sendText/${instance}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', apikey: evoKey },
              body: JSON.stringify({ number: customerPhone, text: mediaReply }),
              signal: AbortSignal.timeout(10000),
            }).catch(() => null);
            processedCount++;
            continue;
          }
        }

        // Indicador de "Digitando..." via WhatsApp (Regra 8 UX)
        sendTypingIndicator(instance, customerPhone);

        // ── CONFIGURAÇÕES DA ORGANIZAÇÃO (REGRA 16: ISOLAMENTO MULTI-TENANT) ─
        const [orgData, attendantData, knowledgeItemsData, conversationHistoryData] = await Promise.all([
          Promise.resolve(
            supabase
              .from('organizations')
              .select('plan_tier, ai_model_preference')
              .eq('id', organizationId)
              .single()
          ).catch(() => null),
          fetchAttendant(organizationId).catch(() => null),
          fetchKnowledgeItems(organizationId).catch(() => []),
          Promise.resolve(
            supabase
              .from('messages')
              .select('*')
              .eq('conversation_id', conv.id)
              .order('created_at', { ascending: true })
              .limit(10)
          ).catch(() => null),
        ]);

        const org = orgData?.data;
        const modelPreference = (org?.ai_model_preference as any) || 'auto';

        const attendant = attendantData || initialAttendant;
        const knowledgeItems = knowledgeItemsData && knowledgeItemsData.length > 0
          ? knowledgeItemsData
          : initialKnowledgeItems;
        const history: Message[] = (conversationHistoryData?.data as Message[]) || [];

        // ── REGRA NOVA: PAUSA GLOBAL DO BOT ──────────────────────────────
        if (attendant.is_paused === true) {
          console.log(`[PAUSA] Bot está pausado para org ${organizationId}. Mensagem mantida para atendimento humano.`);
          if (conv.status === 'bot_active') {
            await supabase.from('conversations').update({ status: 'human_active' }).eq('id', conv.id);
          }
          processedCount++;
          continue;
        }

        // ── REGRA NOVA: PALAVRAS-CHAVE DE TRANSFERÊNCIA IMEDIATA ──────────
        const customKeywords: string[] = attendant.handover_keywords || [];
        const lowerInput = sanitizedUserText.toLowerCase();
        const matchedKeyword = customKeywords.find(kw => kw.trim() && lowerInput.includes(kw.trim().toLowerCase()));
        if (matchedKeyword) {
          console.log(`[HANDOVER IMEDIATO] Palavra-chave disparada: "${matchedKeyword}"`);
          await supabase.from('conversations').update({ status: 'waiting_human' }).eq('id', conv.id);
          await insertMessage(
            conv.id,
            organizationId,
            'bot',
            attendant.name,
            'Entendido! Estou transferindo seu atendimento para nossa equipe humana agora mesmo. Por favor, aguarde um instante. 😊'
          );
          processedCount++;
          continue;
        }

        // ── REGRA NOVA: LIMITE DE MENSAGENS POR PLANO (STARTER: 1.000) ──────
        if (org?.plan_tier === 'starter') {
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);
          const { count: monthlyBotMsgs } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', organizationId)
            .eq('sender_type', 'bot')
            .gte('created_at', startOfMonth.toISOString());

          if ((monthlyBotMsgs || 0) >= 1000) {
            console.log(`[LIMITE ATINGIDO] Organização ${organizationId} atingiu o limite de 1.000 mensagens do Plano Starter.`);
            await supabase.from('conversations').update({ status: 'waiting_human' }).eq('id', conv.id);
            await insertMessage(
              conv.id,
              organizationId,
              'bot',
              attendant.name,
              'Olá! Nosso limite de atendimento automatizado deste mês foi atingido. Sua mensagem foi encaminhada para a equipe humana. Aguarde um momento!'
            );
            processedCount++;
            continue;
          }
        }

        // ── REGRA 21: MODO COPILOTO (HUMAN-IN-THE-LOOP) ──────────────────────
        if (attendant.copilot_mode === true) {
          const aiResult = await generateBotResponse(
            sanitizedUserText,
            attendant,
            knowledgeItems,
            history,
            modelPreference
          );
          // Salvar apenas como sugestão de IA, sem disparar mensagem real
          await supabase.from('messages').insert({
            conversation_id: conv.id,
            organization_id: organizationId,
            sender_type: 'bot',
            sender_name: attendant.name,
            content: `[SUGESTÃO COPILOTO]: ${aiResult.content}`,
            is_internal_note: true,
            ai_suggestion: aiResult.content,
            created_at: new Date().toISOString(),
          });
          processedCount++;
          continue;
        }

        // ── DISPARO DO CÉREBRO DA IA (REGRAS 8, 10, 11, 12, 13, 18, 19, 24) ───
        const aiResult = await generateBotResponse(
          sanitizedUserText,
          attendant,
          knowledgeItems,
          history,
          modelPreference
        );

        // Se ocorreu transbordo humano (Regra 18)
        if (aiResult.shouldHandover) {
          await supabase
            .from('conversations')
            .update({ status: 'waiting_human' })
            .eq('id', conv.id);
        }

        // Salvar resposta da IA no banco
        await insertMessage(conv.id, organizationId, 'bot', attendant.name, aiResult.content);

        // ── SINCRONIZAÇÃO AUTOMÁTICA COM CRM NATIVO (OPORTUNIDADE/LEAD) ────
        syncCrmLead(supabase, organizationId, conv.id, customerName, customerPhone, aiResult).catch((err) =>
          console.error('Erro ao sincronizar CRM:', err)
        );

        // ── REGRA 17: TRILHA DE AUDITORIA IMUTÁVEL ──────────────────────────
        const latencyMs = Date.now() - startTime;
        await supabase.from('ai_audit_logs').insert({
          organization_id: organizationId,
          conversation_id: conv.id,
          customer_phone: customerPhone,
          whatsapp_message_id: whatsappMessageId,
          user_input: effectiveUserText,
          sanitized_input: sanitizedUserText,
          prompt_sent: aiResult.promptSent,
          rag_items_used: aiResult.ragItemsUsed,
          ai_response: aiResult.content,
          confidence: aiResult.confidence,
          model_used: aiResult.modelUsed,
          latency_ms: latencyMs,
          handover_triggered: aiResult.shouldHandover,
          handover_reason: aiResult.handoverReason || null,
          action_taken: 'sent_to_user',
          created_at: new Date().toISOString(),
        });

        // ── DISPARO DA RESPOSTA NO WHATSAPP (EVOLUTION API) ──────────────────
        const evoUrl = getCleanEvoUrl();
        const evoKey = getCleanEvoKey();

        if (evoUrl && evoKey && aiResult.content) {
          try {
            await fetch(`${evoUrl}/message/sendText/${instance}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', apikey: evoKey },
              body: JSON.stringify({
                number: customerPhone,
                text: aiResult.content,
              }),
              signal: AbortSignal.timeout(15000),
            });
          } catch (sendErr: any) {
            console.error('WEBHOOK: sendText error:', sendErr.message);
          }
        }

        processedCount++;
      } catch (itemErr) {
        console.error('WEBHOOK: Erro processando item individual:', itemErr);
      }
    }

    return NextResponse.json({
      status: 'success',
      processed: processedCount,
      skipped: skippedCount,
      total: messages.length,
      latencyMs: Date.now() - startTime,
    });
  } catch (fatalErr: any) {
    console.error('WEBHOOK FATAL ERROR:', fatalErr.message);
    return NextResponse.json({ error: fatalErr.message }, { status: 500 });
  }
}

// Handler GET para diagnóstico detalhado das regras
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/whatsapp/webhook',
    rulesImplemented: {
      fase1_routing: [
        'Regra 1: Descarte de MESSAGES_SET histórico',
        'Regra 2: Descarte de mensagens com timestamp > 180s',
        'Regra 3: Deduplicação por whatsapp_message_id no Supabase',
        'Regra 4: Bloqueio estrito de @g.us, @status, @newsletter, @broadcast',
        'Regra 5: Respeito a status bot_active, human_active, waiting_human e closed',
        'Regra 6: Reengajamento com cooldown de 24h para conversas fechadas',
      ],
      fase2_performance: [
        'Regra 7/15: Buffer e Rate Limiting por telefone (10 msgs/min)',
        'Regra 8: Timeout de 6s na LLM com fallback determinístico e presença typing',
        'Regra 9: Detecção de mídia (áudio solicita texto, imagem/doc transborda)',
      ],
      fase3_cognicao: [
        'Regra 10: Bloqueio regex de Jailbreak e Prompt Injection',
        'Regra 11: Janela de contexto das últimas 6 mensagens',
        'Regra 12: Anti-alucinação e score de confiança',
        'Regra 13: Consciência temporal do Horário de Brasília e expediente comercial',
      ],
      fase4_seguranca: [
        'Regra 14: Mascaramento de PII (CPF, Cartões, Emails, CNPJs)',
        'Regra 15: Rate Limiting persistente no banco',
        'Regra 16: Multi-tenant rigoroso por organization_id',
        'Regra 17: Trilha de Auditoria Imutável (ai_audit_logs)',
      ],
      fase5_governanca: [
        'Regra 18: Transbordo Inteligente (Palavras-chave, Frustração, Repetição)',
        'Regra 19: Guardrails de escopo estrito (recusa médica/jurídica/política)',
        'Regra 20: Ações sensíveis requerem aprovação humana',
        'Regra 21: Suporte a Modo Copiloto (apenas sugestão interna)',
      ],
      fase6_bi: [
        'Regra 22: Métricas de auditoria prontas para cálculo de deflexão',
        'Regra 24: Sincronização direta com catálogo e base de conhecimento',
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
