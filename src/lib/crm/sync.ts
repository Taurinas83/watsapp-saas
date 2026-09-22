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
    // 1. Buscar se já existe lead para este telefone na organização
    const { data: existingLead } = await supabase
      .from('crm_leads')
      .select('id, stage_id, notes, tags')
      .eq('organization_id', organizationId)
      .eq('contact_phone', customerPhone)
      .maybeSingle();

    // 2. Buscar etapas da organização
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

    // Se o lead não existe, cadastrar na primeira etapa
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

    // Se o lead já existe, atualizar conforme a evolução do atendimento
    const updates: Record<string, any> = {
      conversation_id: conversationId,
      updated_at: new Date().toISOString(),
    };

    if (customerName && customerName !== customerPhone) {
      updates.contact_name = customerName;
    }

    // Se a IA disparou transbordo humano, mover para Atendimento Humano
    if (aiResult?.shouldHandover && humanStage) {
      updates.stage_id = humanStage.id;
    }

    // Se a mensagem enviou link de agendamento, mover para Agendados
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
