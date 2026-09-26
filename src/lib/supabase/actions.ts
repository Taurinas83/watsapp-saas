import { createClient } from './client';
import { Attendant, KnowledgeItem, Conversation, Message, KnowledgeCategory, ConversationStatus } from '@/types';

/**
 * USUÁRIO: Obter o ID da organização do usuário atualmente autenticado
 */
export async function getCurrentUserOrganizationId(): Promise<string> {
  const supabase = createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id, is_super_admin')
        .eq('id', user.id)
        .single();

      // SEGURANÇA: Apenas Super Admin devidamente autenticado pode usar impersonate de organização
      if (profile?.is_super_admin && typeof window !== 'undefined') {
        const impersonated = localStorage.getItem('zapella_impersonate_org');
        if (impersonated) {
          try {
            const parsed = JSON.parse(impersonated);
            if (parsed?.id) {
              return parsed.id;
            }
          } catch (e) {
            console.error('Invalid impersonation json', e);
          }
        }
      }

      if (profile?.organization_id) {
        return profile.organization_id;
      }
    }
  } catch (err) {
    console.error('Erro ao buscar organização do usuário autenticado:', err);
  }

  // Fallback para a organização padrão caso não haja usuário logado ou em ambiente de desenvolvimento
  return 'a0000000-0000-0000-0000-000000000001';
}

/**
 * ATENDENTE: Buscar configurações do atendente virtual no Supabase
 */
export async function fetchAttendant(organizationId: string, customClient?: any): Promise<Attendant | null> {
  const supabase = customClient || createClient();
  const { data, error } = await supabase
    .from('attendants')
    .select('*')
    .eq('organization_id', organizationId)
    .single();

  if (error || !data) return null;
  return data as Attendant;
}

/**
 * ATENDENTE: Atualizar configurações do atendente virtual (upsert por organization_id)
 */
export async function updateAttendant(attendant: Partial<Attendant> & { organization_id?: string; id?: string }): Promise<boolean> {
  const supabase = createClient();
  const orgId = attendant.organization_id || await getCurrentUserOrganizationId();

  const { error } = await supabase
    .from('attendants')
    .upsert({
      organization_id: orgId,
      name: attendant.name || 'Assistente Virtual',
      personality: attendant.personality || 'professional',
      voice_tone: attendant.voice_tone || 'Atencioso, prestativo e eficiente',
      business_info: attendant.business_info || '',
      custom_instructions: attendant.custom_instructions || '',
      copilot_mode: attendant.copilot_mode ?? false,
      is_paused: attendant.is_paused ?? false,
      handover_keywords: attendant.handover_keywords || ['atendente', 'humano', 'pessoa', 'falar com alguém'],
      calendar_link: attendant.calendar_link || null,
      calendar_instructions: attendant.calendar_instructions || null,
      group_invite_link: attendant.group_invite_link || null,
      group_invite_instructions: attendant.group_invite_instructions || null,
      updated_at: new Date().toISOString()
    }, { onConflict: 'organization_id' });

  if (error) {
    console.error('Erro ao salvar atendente no Supabase:', error);
  }

  return !error;
}

/**
 * ATENDENTE: Pausar ou Ativar o Bot globalmente
 */
export async function toggleBotPause(organizationId: string, isPaused: boolean): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('attendants')
    .update({ is_paused: isPaused, updated_at: new Date().toISOString() })
    .eq('organization_id', organizationId);

  if (error) {
    console.error('Erro ao alternar pausa do bot:', error);
  }
  return !error;
}

/**
 * ATENDENTES: Buscar TODOS os atendentes ativos de uma organização (multi-agente)
 */
export async function fetchAttendants(organizationId: string, customClient?: any): Promise<Attendant[]> {
  const supabase = customClient || createClient();
  const { data, error } = await supabase
    .from('attendants')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as Attendant[];
}

/**
 * ATENDENTES: Criar novo atendente virtual
 */
export async function createAttendant(
  organizationId: string,
  data: Partial<Attendant>
): Promise<Attendant | null> {
  const supabase = createClient();
  const { data: newAttendant, error } = await supabase
    .from('attendants')
    .insert({
      organization_id: organizationId,
      name: data.name || 'Assistente Virtual',
      department: data.department || 'Geral',
      personality: data.personality || 'professional',
      voice_tone: data.voice_tone || 'Atencioso, prestativo e eficiente',
      business_info: data.business_info || '',
      custom_instructions: data.custom_instructions || '',
      routing_keywords: data.routing_keywords || [],
      handover_keywords: data.handover_keywords || ['atendente', 'humano', 'pessoa'],
      copilot_mode: data.copilot_mode ?? false,
      is_paused: data.is_paused ?? false,
      is_active: true,
      calendar_link: data.calendar_link || null,
      calendar_instructions: data.calendar_instructions || null,
      group_invite_link: data.group_invite_link || null,
      group_invite_instructions: data.group_invite_instructions || null,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !newAttendant) {
    console.error('Erro ao criar atendente:', error);
    return null;
  }
  return newAttendant as Attendant;
}

/**
 * ATENDENTES: Desativar (soft delete) atendente
 */
export async function deleteAttendant(attendantId: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('attendants')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', attendantId);

  if (error) console.error('Erro ao desativar atendente:', error);
  return !error;
}

/**
 * CONVERSAS: Transferir conversa entre atendentes e registrar histórico
 */
export async function transferConversation(
  conversationId: string,
  toAttendantId: string,
  transferredBy?: string,
  reason?: string,
  fromAttendantId?: string
): Promise<boolean> {
  const supabase = createClient();

  await supabase.from('conversation_transfers').insert({
    conversation_id: conversationId,
    from_attendant_id: fromAttendantId || null,
    to_attendant_id: toAttendantId,
    transferred_by: transferredBy || null,
    reason: reason || null,
  });

  const { error } = await supabase
    .from('conversations')
    .update({ attendant_id: toAttendantId, status: 'bot_active' })
    .eq('id', conversationId);

  if (error) console.error('Erro ao transferir conversa:', error);
  return !error;
}

/**
 * ROTEAMENTO: Buscar configurações de roteamento da organização
 */
export async function fetchRoutingSettings(organizationId: string): Promise<{
  enableInitialMenu: boolean;
  enableAutoRouting: boolean;
}> {
  const supabase = createClient();
  const { data } = await supabase
    .from('organizations')
    .select('enable_initial_menu, enable_auto_routing')
    .eq('id', organizationId)
    .single();

  return {
    enableInitialMenu: data?.enable_initial_menu ?? true,
    enableAutoRouting: data?.enable_auto_routing ?? false,
  };
}

/**
 * ROTEAMENTO: Atualizar configurações de roteamento da organização
 */
export async function updateRoutingSettings(
  organizationId: string,
  settings: { enableInitialMenu?: boolean; enableAutoRouting?: boolean }
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('organizations')
    .update({
      enable_initial_menu: settings.enableInitialMenu,
      enable_auto_routing: settings.enableAutoRouting,
    })
    .eq('id', organizationId);

  return !error;
}

/**
 * USO / CRÉDITOS: Buscar contagem de mensagens do mês e limite do plano
 */
export async function fetchMonthlyUsage(organizationId: string): Promise<{ count: number; limit: number; planTier: string }> {
  const supabase = createClient();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Buscar plano da organização
  const { data: org } = await supabase
    .from('organizations')
    .select('plan_tier')
    .eq('id', organizationId)
    .single();

  const planTier = org?.plan_tier || 'starter';
  const limit = planTier === 'starter' ? 1000 : Infinity;

  // Contar mensagens enviadas pelo bot no mês corrente
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)
    .eq('sender_type', 'bot')
    .gte('created_at', startOfMonth.toISOString());

  return {
    count: count || 0,
    limit,
    planTier
  };
}

/**
 * BASE DE CONHECIMENTO: Listar todos os itens da empresa
 */
export async function fetchKnowledgeItems(organizationId: string, customClient?: any): Promise<KnowledgeItem[]> {
  const supabase = customClient || createClient();
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as KnowledgeItem[];
}

/**
 * BASE DE CONHECIMENTO: Criar novo item
 */
export async function createKnowledgeItem(
  organizationId: string,
  category: KnowledgeCategory,
  question: string,
  answer: string
): Promise<KnowledgeItem | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('knowledge_items')
    .insert({
      organization_id: organizationId,
      category,
      question,
      answer
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as KnowledgeItem;
}

/**
 * BASE DE CONHECIMENTO: Deletar item
 */
export async function deleteKnowledgeItem(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('knowledge_items')
    .delete()
    .eq('id', id);

  return !error;
}

/**
 * CONVERSAS: Listar conversas da organização
 */
export async function fetchConversations(organizationId: string): Promise<Conversation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('organization_id', organizationId)
    .order('last_message_at', { ascending: false });

  if (error || !data) return [];
  return data as Conversation[];
}

/**
 * CONVERSAS: Alterar status da conversa (Handover)
 */
export async function updateConversationStatus(
  conversationId: string,
  status: ConversationStatus
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('conversations')
    .update({ status })
    .eq('id', conversationId);

  return !error;
}

/**
 * MENSAGENS: Obter mensagens de uma conversa
 */
export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as Message[];
}

/**
 * MENSAGENS: Inserir nova mensagem no histórico
 */
export async function insertMessage(
  conversationId: string,
  organizationId: string,
  senderType: 'customer' | 'bot' | 'operator',
  senderName: string,
  content: string,
  aiSuggestion?: string,
  customClient?: any
): Promise<Message | null> {
  const supabase = customClient || createClient();

  // Inserir mensagem
  const { data: msgData, error: msgError } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      organization_id: organizationId,
      sender_type: senderType,
      sender_name: senderName,
      content: content,
      ai_suggestion: aiSuggestion
    })
    .select()
    .single();

  if (msgError || !msgData) return null;

  // Atualizar última mensagem na tabela de conversas
  await supabase
    .from('conversations')
    .update({
      last_message: content,
      last_message_at: new Date().toISOString()
    })
    .eq('id', conversationId);

  return msgData as Message;
}

/**
 * CONFIGURAÇÕES: Buscar configurações gerais da organização
 */
export async function fetchOrganizationSettings(organizationId: string): Promise<any | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('organizations')
    .select('settings')
    .eq('id', organizationId)
    .single();

  if (error || !data) return null;
  return data.settings || null;
}

/**
 * CONFIGURAÇÕES: Atualizar configurações gerais da organização
 */
export async function updateOrganizationSettings(organizationId: string, settings: any): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('organizations')
    .update({ settings })
    .eq('id', organizationId);

  return !error;
}

