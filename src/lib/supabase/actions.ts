import { createClient } from './client';
import { Attendant, KnowledgeItem, Conversation, Message, KnowledgeCategory, ConversationStatus } from '@/types';

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
 * ATENDENTE: Atualizar configurações do atendente virtual
 */
export async function updateAttendant(attendant: Partial<Attendant> & { id: string }): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('attendants')
    .update({
      name: attendant.name,
      personality: attendant.personality,
      voice_tone: attendant.voice_tone,
      business_info: attendant.business_info,
      custom_instructions: attendant.custom_instructions,
      updated_at: new Date().toISOString()
    })
    .eq('id', attendant.id);

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
