import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const rawUrl = process.env.EVOLUTION_API_URL || 'https://evolution-api-production-5589.up.railway.app';
const EVOLUTION_URL = rawUrl.trim().replace(/\/+$/, '');
const rawKey = process.env.EVOLUTION_API_KEY || 'e5039cbd79c8df9f44f542e9bf4b21bc3ae9a1f191647979f80697888a5a2360';
const EVOLUTION_KEY = rawKey.trim();

// Função auxiliar para sleep (delay antiban)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: NextRequest) {
  try {
    const supabase = createAdminClient();

    // Buscar mensagens pendentes que já passaram do horário agendado
    const now = new Date().toISOString();
    const { data: pendingMessages, error } = await supabase
      .from('scheduled_messages')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(10); // Lote controlado

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!pendingMessages || pendingMessages.length === 0) {
      return NextResponse.json({ processed: 0, message: 'Nenhuma mensagem pendente para disparo no momento.' });
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < pendingMessages.length; i++) {
      const item = pendingMessages[i];

      // Marcar como processando para evitar reentrância
      await supabase
        .from('scheduled_messages')
        .update({ status: 'processing' })
        .eq('id', item.id);

      const instanceName = item.organization_id && item.organization_id !== 'a0000000-0000-0000-0000-000000000001'
        ? `org_${item.organization_id.replace(/[^a-zA-Z0-9]/g, '_')}`
        : 'default_org';

      try {
        // Envio via Evolution API
        const sendRes = await fetch(`${EVOLUTION_URL}/message/sendText/${instanceName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: EVOLUTION_KEY,
          },
          body: JSON.stringify({
            number: item.target_jid,
            text: item.message_content,
          }),
        });

        if (sendRes.ok) {
          await supabase
            .from('scheduled_messages')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              error_message: null,
            })
            .eq('id', item.id);
          successCount++;
        } else {
          const errData = await sendRes.json().catch(() => ({}));
          await supabase
            .from('scheduled_messages')
            .update({
              status: 'failed',
              error_message: `Erro Evolution HTTP ${sendRes.status}: ${JSON.stringify(errData)}`,
            })
            .eq('id', item.id);
          failCount++;
        }
      } catch (sendErr: any) {
        await supabase
          .from('scheduled_messages')
          .update({
            status: 'failed',
            error_message: sendErr.message || 'Erro ao conectar à Evolution API',
          })
          .eq('id', item.id);
        failCount++;
      }

      // Regra Antiban: se houver mais de uma mensagem no lote, aplicar delay humanizado (jitter de 15 a 30 segundos)
      if (i < pendingMessages.length - 1) {
        const jitterMs = Math.floor(Math.random() * 15000) + 15000; // Entre 15s e 30s
        console.log(`[ANTIBAN] Aguardando ${jitterMs}ms antes do próximo envio de grupo...`);
        await sleep(jitterMs);
      }
    }

    return NextResponse.json({
      processed: pendingMessages.length,
      successCount,
      failCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Erro no disparador de mensagens agendadas:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
