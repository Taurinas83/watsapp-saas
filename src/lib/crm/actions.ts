import { createClient } from '@/lib/supabase/client';
import { CrmStage, CrmLead } from '@/types';

export const DEFAULT_CRM_STAGES = [
  { name: 'Novos Leads', color: '#3B82F6', order_index: 0 },
  { name: 'Em Qualificação (IA)', color: '#8B5CF6', order_index: 1 },
  { name: 'Qualificados', color: '#0EA5E9', order_index: 2 },
  { name: 'Agendados', color: '#F59E0B', order_index: 3 },
  { name: 'Atendimento Humano', color: '#EC4899', order_index: 4 },
  { name: 'Fechados / Ganho', color: '#10B981', order_index: 5 },
  { name: 'Perdidos', color: '#64748B', order_index: 6 },
];

export async function fetchCrmBoard(organizationId: string): Promise<{ stages: CrmStage[]; leads: CrmLead[] }> {
  const supabase = createClient();

  // 1. Buscar etapas existentes
  let { data: stages, error: stagesError } = await supabase
    .from('crm_stages')
    .select('*')
    .eq('organization_id', organizationId)
    .order('order_index', { ascending: true });

  if (stagesError) {
    console.error('Erro ao buscar etapas do CRM:', stagesError);
  }

  // 2. Se a organização não possui etapas, criar as etapas padrão
  if (!stages || stages.length === 0) {
    const toInsert = DEFAULT_CRM_STAGES.map((s) => ({
      organization_id: organizationId,
      name: s.name,
      color: s.color,
      order_index: s.order_index,
    }));

    const { data: insertedStages, error: insertError } = await supabase
      .from('crm_stages')
      .insert(toInsert)
      .select();

    if (!insertError && insertedStages) {
      stages = insertedStages as CrmStage[];
    } else {
      console.error('Erro ao criar etapas padrão do CRM:', insertError);
    }
  }

  // 3. Buscar leads da organização
  const { data: leads, error: leadsError } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (leadsError) {
    console.error('Erro ao buscar leads do CRM:', leadsError);
  }

  return {
    stages: (stages || []) as CrmStage[],
    leads: (leads || []) as CrmLead[],
  };
}

export async function createCrmLead(lead: {
  organization_id: string;
  stage_id: string;
  contact_name: string;
  contact_phone: string;
  deal_value?: number;
  ai_summary?: string;
  tags?: string[];
  notes?: string;
  conversation_id?: string;
}): Promise<CrmLead | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('crm_leads')
    .insert({
      organization_id: lead.organization_id,
      stage_id: lead.stage_id,
      contact_name: lead.contact_name,
      contact_phone: lead.contact_phone,
      deal_value: lead.deal_value || 0,
      ai_summary: lead.ai_summary || null,
      tags: lead.tags || [],
      notes: lead.notes || null,
      conversation_id: lead.conversation_id || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar lead no CRM:', error);
    return null;
  }

  return data as CrmLead;
}

export async function updateLeadStage(leadId: string, newStageId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('crm_leads')
    .update({
      stage_id: newStageId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId);

  if (error) {
    console.error('Erro ao mover lead de etapa:', error);
    return false;
  }

  return true;
}

export async function updateCrmLead(
  leadId: string,
  updates: Partial<Omit<CrmLead, 'id' | 'organization_id' | 'created_at'>>
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('crm_leads')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', leadId);

  if (error) {
    console.error('Erro ao atualizar lead:', error);
    return false;
  }

  return true;
}

export async function deleteCrmLead(leadId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('crm_leads')
    .delete()
    .eq('id', leadId);

  if (error) {
    console.error('Erro ao excluir lead do CRM:', error);
    return false;
  }

  return true;
}
