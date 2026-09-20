export type PersonalityType = 'friendly' | 'professional' | 'casual';

export type WhatsAppStatus = 'disconnected' | 'connecting' | 'connected';

export type ConversationStatus = 'bot_active' | 'waiting_human' | 'human_active' | 'closed';

export type KnowledgeCategory = 'faq' | 'product' | 'pricing' | 'hours' | 'general';

export type SenderType = 'customer' | 'bot' | 'operator';

export type UserRole = 'admin' | 'operator';

export type AdminRole = 'super_admin' | 'support' | 'finance';

export type OrganizationStatus = 'active' | 'suspended' | 'trialing' | 'canceled';

export interface Organization {
  id: string;
  name: string;
  stripe_customer_id?: string;
  stripe_subscription_status: string;
  created_at: string;
  plan_tier?: string;
  ai_model_preference?: string;
  status?: OrganizationStatus;
  suspended_reason?: string;
  custom_mrr?: number;
  billing_cycle?: string;
  settings?: Record<string, any>;
}

export interface Profile {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  is_super_admin?: boolean;
  admin_role?: AdminRole;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_name?: string;
  admin_email?: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  organization_name?: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'canceled';
  gateway: string;
  gateway_invoice_id?: string;
  invoice_url?: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
}

export interface PlatformSetting {
  key: string;
  value: any;
  updated_by?: string;
  updated_at: string;
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
  business_hours_start?: number;
  business_hours_end?: number;
  copilot_mode?: boolean;
  allowed_topics?: string[];
  is_paused?: boolean;
  handover_keywords?: string[];
  updated_at?: string;
}

export interface AIAuditLog {
  id: string;
  organization_id: string;
  conversation_id?: string;
  customer_phone: string;
  whatsapp_message_id?: string;
  user_input: string;
  sanitized_input: string;
  prompt_sent?: string;
  rag_items_used?: any[];
  ai_response?: string;
  confidence?: number;
  model_used?: string;
  latency_ms?: number;
  handover_triggered?: boolean;
  handover_reason?: string;
  action_taken?: string;
  created_at: string;
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
