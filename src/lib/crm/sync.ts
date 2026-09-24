import { SupabaseClient } from '@supabase/supabase-js';
import { BotResponseResult } from '@/lib/ai-engine';

export async function syncCrmLead(
  supabase: SupabaseClient,
  organizationId: string,
  conversationId: string,
  customerName: string,
  customerPhone: string,
  aiResult?: BotResponseResult
) {
  try {
    // 1. Executa a procedure segura (SECURITY DEFINER) no Postgres
    // Garante atomicidade, velocidade (1 round trip) e contorna bloqueios de RLS no webhook
    const { error: rpcError } = await supabase.rpc('sync_crm_lead_rpc', {
      p_org_id: organizationId,
      p_conversation_id: conversationId,
      p_customer_name: customerName || '',
      p_customer_phone: customerPhone,
      p_ai_content: aiResult?.content || '',
      p_should_handover: aiResult?.shouldHandover || false,
    });

    if (!rpcError) {
      return;
    }

    console.warn('[CRM Sync] RPC fallback para queries diretas:', rpcError);

    // Fallback: caso a RPC não esteja disponível por qualquer motivo
    const { data: existingLead } = await supabase
      .from('crm_leads')
      .select('id, stage_id, notes, tags')
      .eq('organization_id', organizationId)
      .eq('contact_phone', customerPhone)
      .maybeSingle();

    const { data: stages } = await supabase
      .from('crm_stages')
      .select('id, name, order_index')
      .eq('organization_id', organizationId)
      .order('order_index', { ascending: true });

    if (!stages || stages.length === 0) return;

    const newLeadStage = stages.find((s) => s.name.toLowerCase().includes('novo')) || stages[0];
    const qualifyingStage = stages.find((s) => s.name.toLowerCase().includes('qualifica')) || newLeadStage;
    const humanStage = stages.find((s) => s.name.toLowerCase().includes('humano')) || stages[0];
    const scheduledStage = stages.find((s) => s.name.toLowerCase().includes('agendad')) || stages[0];

    if (!existingLead) {
      const initialStageId = aiResult?.shouldHandover ? humanStage.id : qualifyingStage.id;

      await supabase.from('crm_leads').insert({
        organization_id: organizationId,
        conversation_id: conversationId,
        stage_id: initialStageId,
        contact_name: customerName || customerPhone,
        contact_phone: customerPhone,
        deal_value: 0,
        ai_summary: aiResult?.content ? `Primeiro contato: ${aiResult.content.slice(0, 150)}...` : 'Novo contato via WhatsApp',
        tags: ['WhatsApp', 'Orgânico'],
      });
      return;
    }

    const updates: Record<string, any> = {
      conversation_id: conversationId,
      updated_at: new Date().toISOString(),
    };

    if (customerName && customerName !== customerPhone) {
      updates.contact_name = customerName;
    }

    if (aiResult?.shouldHandover && humanStage) {
      updates.stage_id = humanStage.id;
    }

    if (
      aiResult?.content &&
      (aiResult.content.includes('calendly.com') ||
        aiResult.content.includes('cal.com') ||
        aiResult.content.includes('calendar.google.com') ||
        aiResult.content.toLowerCase().includes('agenda oficial')) &&
      scheduledStage
    ) {
      updates.stage_id = scheduledStage.id;
      const currentTags = existingLead.tags || [];
      if (!currentTags.includes('Link Agenda')) {
        updates.tags = [...currentTags, 'Link Agenda'];
      }
    }

    await supabase
      .from('crm_leads')
      .update(updates)
      .eq('id', existingLead.id);
  } catch (err) {
    console.error('Erro em syncCrmLead:', err);
  }
}
