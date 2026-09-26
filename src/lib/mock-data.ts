import { Attendant, KnowledgeItem, Conversation, Message, MetricsSummary } from '@/types';

export const initialAttendant: Attendant = {
  id: 'attendant-1',
  organization_id: 'a0000000-0000-0000-0000-000000000001',
  name: 'Atendente Virtual',
  department: 'Geral',
  personality: 'friendly',
  voice_tone: 'Amigável, acolhedor e objetivo',
  business_info: 'Somos uma empresa comprometida com a excelência no atendimento aos nossos clientes. Atendemos de segunda a sexta-feira das 08h às 18h.',
  custom_instructions: 'Sempre cumprimente os clientes com gentileza e educação. Responda às perguntas com clareza com base nas informações cadastradas.',
  whatsapp_status: 'disconnected',
  whatsapp_phone: '',
  is_active: true,
  routing_keywords: [],
  updated_at: new Date().toISOString()
};

export const initialKnowledgeItems: KnowledgeItem[] = [];

export const initialConversations: Conversation[] = [];

export const initialMessages: Record<string, Message[]> = {};

export const initialMetrics: MetricsSummary = {
  totalConversations: 0,
  avgResponseTimeSeconds: 0,
  aiResolutionRate: 100,
  handoverRate: 0,
  activeToday: 0,
  weeklyGrowth: 0,
  conversationsByDay: [
    { day: 'Seg', bot: 0, human: 0 },
    { day: 'Ter', bot: 0, human: 0 },
    { day: 'Qua', bot: 0, human: 0 },
    { day: 'Qui', bot: 0, human: 0 },
    { day: 'Sex', bot: 0, human: 0 },
    { day: 'Sáb', bot: 0, human: 0 },
    { day: 'Dom', bot: 0, human: 0 }
  ],
  categoryDistribution: [],
  operatorRanking: []
};

