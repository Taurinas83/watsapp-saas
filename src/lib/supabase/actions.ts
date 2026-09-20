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
        .select('organization_id')
        .eq('id', user.id)
        .single();

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
export async function fetchAttendant(organizationId: string): Promise<Attendant | null> {
  const supabase = createClient();
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
      updated_at: new Date().toISOString()
    }, { onConflict: 'organization_id' });

  if (error) {
    console.error('Erro ao salvar atendente no Supabase:', error);
  }

  return !error;
}

/**
 * BASE DE CONHECIMENTO: Listar todos os itens da empresa
 */
export async function fetchKnowledgeItems(organizationId: string): Promise<KnowledgeItem[]> {
  const supabase = createClient();
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
  aiSuggestion?: string
): Promise<Message | null> {
  const supabase = createClient();

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

