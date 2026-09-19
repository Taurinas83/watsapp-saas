export type PersonalityType = 'friendly' | 'professional' | 'casual';

export type WhatsAppStatus = 'disconnected' | 'connecting' | 'connected';

export type ConversationStatus = 'bot_active' | 'waiting_human' | 'human_active' | 'closed';

export type KnowledgeCategory = 'faq' | 'product' | 'pricing' | 'hours' | 'general';

export type SenderType = 'customer' | 'bot' | 'operator';

export type UserRole = 'admin' | 'operator';

export interface Organization {
  id: string;
  name: string;
  stripe_customer_id?: string;
  stripe_subscription_status: string;
  created_at: string;
}

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

export interface Attendant {
  id: string;
  organization_id: string;
  name: string;
  personality: PersonalityType;
  voice_tone: string;
  business_info: string;
  custom_instructions: string;
  whatsapp_status: WhatsAppStatus;
  whatsapp_phone?: string;
  updated_at?: string;
}

export interface KnowledgeItem {
  id: string;
  organization_id: string;
  category: KnowledgeCategory;
  question: string;
  answer: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  organization_id: string;
  customer_phone: string;
  customer_name: string;
  status: ConversationStatus;
  last_message: string;
  last_message_at: string;
  tags: string[];
  internal_notes?: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  organization_id: string;
  sender_type: SenderType;
  sender_name?: string;
  content: string;
  is_internal_note?: boolean;
  ai_suggestion?: string;
  created_at: string;
}

export interface MetricsSummary {
  totalConversations: number;
  avgResponseTimeSeconds: number;
  aiResolutionRate: number;
  handoverRate: number;
  activeToday: number;
  weeklyGrowth: number;
  conversationsByDay: { day: string; bot: number; human: number }[];
  categoryDistribution: { category: string; count: number }[];
  operatorRanking: { name: string; avatar: string; count: number; rating: number }[];
}
