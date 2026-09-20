import { Attendant, KnowledgeItem, Message } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 14: MASCARAMENTO DE PII (DADOS SENSÍVEIS)
// ─────────────────────────────────────────────────────────────────────────────
export const piiPatterns = {
  cpf: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
  creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  cnpj: /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g,
};

export function maskPII(text: string): { sanitized: string; wasMasked: boolean } {
  let sanitized = text;
  let wasMasked = false;

  for (const [key, pattern] of Object.entries(piiPatterns)) {
    if (pattern.test(sanitized)) {
      wasMasked = true;
      sanitized = sanitized.replace(pattern, `[${key.toUpperCase()}_REMOVIDO]`);
    }
  }

  return { sanitized, wasMasked };
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 10: DEFESA CONTRA PROMPT INJECTION
// ─────────────────────────────────────────────────────────────────────────────
export const injectionPatterns = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /desconsidere\s+(todas\s+as\s+)?instru[cç][oõ]es/i,
  /ignore\s+as\s+instru[cç][oõ]es\s+anteriores/i,
  /you\s+are\s+now\s+(a|an)?/i,
  /voc[eê]\s+agora\s+[eé]/i,
  /new\s+role/i,
  /novo\s+papel/i,
  /system\s+prompt/i,
  /prompt\s+do\s+sistema/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions)/i,
  /revele\s+(suas\s+)?instru[cç][oõ]es/i,
  /dan\s+mode/i,
  /jailbreak/i,
];

export function detectPromptInjection(text: string): boolean {
  return injectionPatterns.some((pattern) => pattern.test(text));
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 13: CONSCIÊNCIA TEMPORAL
// ─────────────────────────────────────────────────────────────────────────────
export function getTemporalContext(attendant: Attendant): {
  timeString: string;
  isBusinessHours: boolean;
  businessHoursText: string;
  dayOfWeek: string;
} {
  const now = new Date();
  
  // Formatador fuso horário de Brasília
  const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
  });
  
  const hourFormatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    hour12: false,
  });

  const parts = timeFormatter.formatToParts(now);
  const currentHour = parseInt(hourFormatter.format(now), 10);
  const dayOfWeek = parts.find((p) => p.type === 'weekday')?.value || 'dia atual';

  const startHour = attendant.business_hours_start ?? 9;
  const endHour = attendant.business_hours_end ?? 18;

  const isBusinessHours = currentHour >= startHour && currentHour < endHour;

  return {
    timeString: `${currentHour.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} (Horário de Brasília)`,
    isBusinessHours,
    businessHoursText: `${startHour}h às ${endHour}h`,
    dayOfWeek,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTRUÇÃO DO SYSTEM PROMPT (REGRAS 11, 13, 19)
// ─────────────────────────────────────────────────────────────────────────────
export function buildSystemPrompt(
  attendant: Attendant,
  relevantKnowledge: KnowledgeItem[]
): string {
  const personalityStyles: Record<string, string> = {
    friendly: 'Você é extremamente amigável, caloroso, simpático, usa emojis moderados com empatia e entusiasmo.',
    professional: 'Você é profissional, educado, claro, objetivo, elegante e altamente eficiente.',
    casual: 'Você é descontraído, moderno, fala de forma natural e leve, sem formalidades excessivas.',
  };

  const styleDescription = personalityStyles[attendant.personality] || personalityStyles.professional;
  const temporal = getTemporalContext(attendant);

  let knowledgeSection = '';
  if (relevantKnowledge.length > 0) {
    knowledgeSection = `\n--- BASE DE CONHECIMENTO OFICIAL DISPONÍVEL ---\nUtilize PRIORITARIAMENTE as respostas e informações abaixo:\n` +
      relevantKnowledge.map((item, idx) => `[Item ${idx + 1} - ${item.category.toUpperCase()}]\nPergunta: ${item.question}\nResposta: ${item.answer}`).join('\n\n') +
      `\n-----------------------------------------------\n`;
  } else {
    knowledgeSection = `\n--- BASE DE CONHECIMENTO ---\nNenhuma informação cadastrada para a dúvida específica. Responda educadamente e, se for algo além do básico, ofereça transferir para a equipe humana.\n`;
  }

  const allowedTopics = attendant.allowed_topics && attendant.allowed_topics.length > 0
    ? attendant.allowed_topics.join(', ')
    : 'atendimento comercial, informações da empresa, dúvidas frequentes, horários, preços e agendamentos';

  return `Você é ${attendant.name}, atendente virtual oficial via WhatsApp.

${styleDescription}

CONTEXTO TEMPORAL:
- Dia da semana: ${temporal.dayOfWeek}
- Horário atual da mensagem: ${temporal.timeString}
- Horário de atendimento da equipe humana: ${temporal.businessHoursText}
${!temporal.isBusinessHours ? `*AVISO*: No momento a loja/empresa está FORA do expediente humano. Você pode tirar dúvidas básicas, mas informe com naturalidade que solicitações complexas serão atendidas pela equipe a partir das ${attendant.business_hours_start ?? 9}h.` : ''}

ESCOPO E REGRAS DE CONDUTA OBRIGATÓRIAS (GUARDRAILS):
1. Seu escopo de atendimento é estritamente: ${allowedTopics}.
2. Se o cliente perguntar sobre conselhos médicos, diagnósticos, consultoria jurídica ou opiniões políticas, recuse gentilmente: "Desculpe, só posso ajudar com assuntos relacionados aos nossos serviços."
3. NUNCA invente preços, promoções ou prazos que não constem na Base de Conhecimento ou nas Informações do Negócio.
4. Responda em Português do Brasil com linguagem dinâmica para WhatsApp (mensagens compactas, negrito *assim*, quebras de linha limpas).
5. Se não souber a informação com certeza absoluta, jamais alucine. Ofereça transferir para o atendimento humano.

INFORMAÇÕES DA EMPRESA:
${attendant.business_info || 'Atendimento comercial via WhatsApp.'}

INSTRUÇÕES EXTRAS DO GESTOR:
${attendant.custom_instructions || 'Seja prestativo, empático e resolutivo.'}

${knowledgeSection}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 18: TRANSBORDO INTELIGENTE (HANDOVER)
// ─────────────────────────────────────────────────────────────────────────────
export function checkHandoverTriggers(
  userMessage: string,
  recentHistory: Message[] = []
): { trigger: boolean; reason?: string } {
  const msgLower = userMessage.toLowerCase();

  // Gatilho 1: Explícito
  const explicitHumanKeywords = [
    'falar com humano', 'falar com pessoa', 'atendente humano', 'falar com atendente',
    'quero um atendente', 'chamar atendente', 'pessoa de verdade', 'humano por favor',
    'falar com alguem', 'falar com alguém', 'falar com gerente', 'falar com recepcionista',
    'passa para alguém', 'falar com suporte',
  ];
  if (explicitHumanKeywords.some((kw) => msgLower.includes(kw))) {
    return { trigger: true, reason: 'requested_by_user' };
  }

  // Gatilho 2: Sentimento / Insatisfação grave
  const dissatisfactionKeywords = [
    'reclamação', 'reclamacao', 'insatisfeito', 'péssimo', 'pessimo', 'horrível', 'horrivel',
    'vou ao procon', 'processar', 'odiei', 'lixo', 'cancelar contrato', 'gerente agora',
    'atendimento horrível', 'não resolve nada', 'robô inútil',
  ];
  if (dissatisfactionKeywords.some((kw) => msgLower.includes(kw))) {
    return { trigger: true, reason: 'negative_sentiment' };
  }

  // Gatilho 3: Falha repetida (ex: 2 últimas mensagens do cliente sem resolução)
  const lastCustomerMessages = recentHistory
    .filter((m) => m.sender_type === 'customer')
    .slice(-3);
  if (lastCustomerMessages.length >= 3) {
    const repeatedQuery = lastCustomerMessages.every(
      (m) => m.content.toLowerCase().trim() === msgLower.trim()
    );
    if (repeatedQuery) {
      return { trigger: true, reason: 'repeated_failure' };
    }
  }

  return { trigger: false };
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 16: BUSCA RAG ISOLADA MULTI-TENANT
// ─────────────────────────────────────────────────────────────────────────────
export function searchKnowledgeBase(
  userQuery: string,
  knowledgeItems: KnowledgeItem[]
): KnowledgeItem[] {
  const queryLower = userQuery.toLowerCase().trim();
  const words = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = knowledgeItems.map((item) => {
    let score = 0;
    const qLower = item.question.toLowerCase();
    const aLower = item.answer.toLowerCase();

    if (qLower.includes(queryLower)) score += 12;
    if (aLower.includes(queryLower)) score += 6;

    words.forEach((word) => {
      if (qLower.includes(word)) score += 3;
      if (aLower.includes(word)) score += 1;
    });

    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.item);
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 8: CHAMADA LLM COM TIMEOUT RÍGIDO (CLAUDE & GEMINI)
// ─────────────────────────────────────────────────────────────────────────────
const LLM_TIMEOUT_MS = 6000; // 6 segundos limite

export async function generateClaudeResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string | null> {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) return null;

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    // REGRA 11: Gestão de janela de contexto (últimas 6 mensagens)
    const recentMessages = conversationHistory.slice(-6).map((m) => ({
      role: m.sender_type === 'customer' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    }));

    const responsePromise = anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 450,
      system: systemPrompt,
      messages: [
        ...recentMessages,
        { role: 'user' as const, content: userMessage },
      ],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('LLM_TIMEOUT')), LLM_TIMEOUT_MS)
    );

    const response = await Promise.race([responsePromise, timeoutPromise]);
    const textBlock = response.content.find((c) => c.type === 'text');
    return textBlock?.text || null;
  } catch (err: any) {
    console.error('Erro na chamada Anthropic Claude:', err.message);
    return null;
  }
}

export async function generateGeminiResponse(
  systemPrompt: string,
  userMessage: string
): Promise<string | null> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) return null;

  try {
    const fetchPromise = fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nMensagem do Cliente no WhatsApp: ${userMessage}` }],
            },
          ],
        }),
      }
    );

    const timeoutPromise = new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('LLM_TIMEOUT')), LLM_TIMEOUT_MS)
    );

    const res = await Promise.race([fetchPromise, timeoutPromise]);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err: any) {
    console.error('Erro na chamada Gemini API:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 12 & 24: MOTOR PRINCIPAL COM FILTRO DE CONFIANÇA E CATÁLOGO
// ─────────────────────────────────────────────────────────────────────────────
export interface BotResponseResult {
  content: string;
  shouldHandover: boolean;
  handoverReason?: string;
  confidence: number;
  modelUsed: string;
  ragItemsUsed: KnowledgeItem[];
  promptSent: string;
  isFallback?: boolean;
}

export async function generateBotResponse(
  userMessage: string,
  attendant: Attendant,
  knowledgeItems: KnowledgeItem[],
  conversationHistory: Message[] = [],
  modelPreference: 'claude' | 'gemini' = 'claude'
): Promise<BotResponseResult> {
  // 1. Defesa contra Prompt Injection (Regra 10)
  if (detectPromptInjection(userMessage)) {
    return {
      content: 'Desculpe, não posso processar esse tipo de instrução. Como posso te auxiliar com os serviços da nossa empresa?',
      shouldHandover: false,
      confidence: 1.0,
      modelUsed: 'guardrail_injection',
      ragItemsUsed: [],
      promptSent: 'PROMPT_INJECTION_DETECTED',
    };
  }

  // 2. Transbordo Inteligente (Regra 18)
  const handover = checkHandoverTriggers(userMessage, conversationHistory);
  if (handover.trigger) {
    return {
      content: `Entendido perfeitamente! Estou transferindo o seu atendimento para a nossa equipe agora mesmo. Em breve um de nossos atendentes irá te responder aqui! 😊`,
      shouldHandover: true,
      handoverReason: handover.reason,
      confidence: 1.0,
      modelUsed: 'guardrail_handover',
      ragItemsUsed: [],
      promptSent: `HANDOVER_TRIGGER: ${handover.reason}`,
    };
  }

  // 3. Consulta ao Catálogo / Base de Conhecimento RAG (Regra 16 e 24)
  const relevantKnowledge = searchKnowledgeBase(userMessage, knowledgeItems);
  const systemPrompt = buildSystemPrompt(attendant, relevantKnowledge);

  // 4. Chamada de IA com Timeout e Fallback (Regra 8)
  let aiContent: string | null = null;
  let modelUsed = 'none';

  if (modelPreference === 'claude' || !process.env.GEMINI_API_KEY) {
    aiContent = await generateClaudeResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'claude-3-5-sonnet';
  }

  if (!aiContent && process.env.GEMINI_API_KEY) {
    aiContent = await generateGeminiResponse(systemPrompt, userMessage);
    if (aiContent) modelUsed = 'gemini-1.5-flash';
  }

  // 5. Se o modelo respondeu com sucesso
  if (aiContent) {
    return {
      content: aiContent,
      shouldHandover: false,
      confidence: 0.95,
      modelUsed,
      ragItemsUsed: relevantKnowledge,
      promptSent: systemPrompt,
    };
  }

  // 6. Fallback Resiliente (Regra 8 & 12)
  if (relevantKnowledge.length > 0) {
    const topItem = relevantKnowledge[0];
    const greeting = attendant.personality === 'friendly' ? 'Olá! 😊 ' : 'Olá! ';
    return {
      content: `${greeting}${topItem.answer}`,
      shouldHandover: false,
      confidence: 0.85,
      modelUsed: 'rag_deterministic_fallback',
      ragItemsUsed: [topItem],
      promptSent: systemPrompt,
      isFallback: true,
    };
  }

  const defaultGreeting = attendant.personality === 'friendly'
    ? `Olá! Obrigado por entrar em contato com a ${attendant.name || 'nossa equipe'}. Como posso te ajudar hoje?`
    : `Olá! Como posso ajudar você hoje?`;

  return {
    content: defaultGreeting,
    shouldHandover: false,
    confidence: 0.70,
    modelUsed: 'system_default_fallback',
    ragItemsUsed: [],
    promptSent: systemPrompt,
    isFallback: true,
  };
}
