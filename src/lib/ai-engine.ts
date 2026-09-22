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
// CONSTRUÇÃO DO SYSTEM PROMPT HUMANIZADO E CONVERSACIONAL (CALIBRAÇÃO PRO)
// ─────────────────────────────────────────────────────────────────────────────
export function buildSystemPrompt(
  attendant: Attendant,
  relevantKnowledge: KnowledgeItem[]
): string {
  const personalityStyles: Record<string, string> = {
    friendly: 'Seu tom é caloroso, atencioso, empático e muito acolhedor, com uso leve e natural de emojis.',
    professional: 'Seu tom é polido, elegante, claro, seguro e focado em gerar valor com rapidez e sofisticação.',
    casual: 'Seu tom é descontraído, moderno, ágil e parceiro, falando de igual para igual de forma fluida.',
  };

  const styleDescription = personalityStyles[attendant.personality] || personalityStyles.friendly;
  const temporal = getTemporalContext(attendant);

  let knowledgeSection = '';
  if (relevantKnowledge.length > 0) {
    knowledgeSection = `\n--- BASE DE DADOS E CONHECIMENTO DISPONÍVEL ---\nUse estas informações como fonte de verdade para embasar suas respostas com naturalidade (sem copiar e colar blocos inteiros frios):\n` +
      relevantKnowledge.map((item, idx) => `[Referência ${idx + 1} - ${item.category.toUpperCase()}]\nTópico: ${item.question}\nConteúdo Oficial: ${item.answer}`).join('\n\n') +
      `\n-----------------------------------------------\n`;
  }

  const allowedTopics = attendant.allowed_topics && attendant.allowed_topics.length > 0
    ? attendant.allowed_topics.join(', ')
    : 'atendimento comercial, informações da empresa, dúvidas frequentes, horários, preços, mentorias e projetos';

  return `Você é ${attendant.name}, atendendo diretamente pelo WhatsApp da empresa.

DIRETRIZES DE COMUNICAÇÃO NO WHATSAPP (MUITO IMPORTANTE):
1. **Converse como uma pessoa de verdade**: Seja natural, empático, acolhedor e próximo. NUNCA soe como um robô, atendente de telemarketing, chatbot engessado ou formulário de autoatendimento.
2. **Responda exatamente ao que foi perguntado**: Se a pessoa perguntar "quem é você?", "quem fala?" ou disser "olá", apresente-se com carisma e simpatia de forma breve e acolhedora, convidando para o diálogo. NUNCA responda a uma saudação despejando listas inteiras de produtos, preços ou tópicos prontos.
3. **Fluidez e concisão**: No WhatsApp as pessoas lêem no celular. Use mensagens ágeis, frases diretas e quebras de linha limpas.
4. **Sem blocos gigantes**: Apresente uma informação relevante por vez e faça uma pergunta de volta para manter a conversa viva e personalizada.
5. **Tom de voz**: ${styleDescription}

CONTEXTO TEMPORAL:
- Dia da semana: ${temporal.dayOfWeek}
- Horário atual: ${temporal.timeString}
- Expediente de suporte humano: ${temporal.businessHoursText}
${!temporal.isBusinessHours ? `*Atenção*: Estamos fora do expediente da equipe física. Você pode tirar dúvidas e bater papo normalmente com o cliente, apenas avisando com gentileza caso haja algo que exija retorno posterior da equipe.` : ''}

GUARDRAILS E LIMITES:
- Seu escopo é: ${allowedTopics}.
- Se o cliente perguntar sobre conselhos médicos, diagnósticos, consultoria jurídica ou posições políticas, decline cordialmente: "Desculpe, meu foco é te ajudar com os nossos serviços e soluções."
- NUNCA invente preços ou promessas que não constem na sua base de informações.
- Se não souber responder com certeza, seja transparente e ofereça verificar ou chamar alguém da equipe.

INFORMAÇÕES SOBRE A EMPRESA E O ESPECIALISTA:
${attendant.business_info || 'Atendimento via WhatsApp.'}

INSTRUÇÕES DO GESTOR:
${attendant.custom_instructions || 'Seja prestativo, empático e resolutivo.'}

${attendant.calendar_link?.trim() ? `
AGENDAMENTO DE REUNIÕES / CALLS / ATENDIMENTOS:
- Link oficial da Agenda do Especialista: ${attendant.calendar_link.trim()}
${attendant.calendar_instructions ? `- Instruções adicionais de agendamento: ${attendant.calendar_instructions}` : ''}
- Sempre que o cliente demonstrar interesse em marcar uma reunião, agendar uma conversa, consulta, call ou demonstração, apresente e envie o link de agendamento: "${attendant.calendar_link.trim()}", orientando-o com gentileza a escolher o melhor dia e horário diretamente no link.
` : ''}
${attendant.group_invite_link?.trim() ? `
COMUNIDADE / GRUPO VIP NO WHATSAPP:
- Link de convite oficial do Grupo: ${attendant.group_invite_link.trim()}
${attendant.group_invite_instructions ? `- Instruções do grupo: ${attendant.group_invite_instructions}` : ''}
- Quando for oportuno, no encerramento ou ao falar de novidades, conteúdos ou ofertas exclusivas, convide o cliente para entrar no nosso Grupo VIP através do link: "${attendant.group_invite_link.trim()}".
` : ''}
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

  // Gatilho 3: Falha repetida (3 mensagens seguidas com exatamente a mesma dúvida)
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
// REGRA 16: BUSCA RAG CONTEXTUAL REFINADA (EVITAR FALSO POSITIVO EM SAUDAÇÕES)
// ─────────────────────────────────────────────────────────────────────────────
export function searchKnowledgeBase(
  userQuery: string,
  knowledgeItems: KnowledgeItem[]
): KnowledgeItem[] {
  const queryLower = userQuery.toLowerCase().trim();

  // Se for apenas saudação ou apresentação básica, não puxar FAQs pesados
  const casualIntents = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'quem fala', 'quem fala?', 'quem é você', 'quem é vc', 'quem é vc?', 'quem e voce', 'quem e vc'];
  if (casualIntents.includes(queryLower)) {
    return [];
  }

  const words = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const scored = knowledgeItems.map((item) => {
    let score = 0;
    const qLower = item.question.toLowerCase();
    const aLower = item.answer.toLowerCase();

    // Match forte na pergunta
    if (qLower.includes(queryLower)) score += 20;
    if (queryLower.length > 5 && qLower.startsWith(queryLower)) score += 10;

    words.forEach((word) => {
      if (qLower.includes(word)) score += 4;
      if (aLower.includes(word)) score += 1;
    });

    return { item, score };
  });

  return scored
    .filter((s) => s.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.item);
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 8: CHAMADA LLM COM TIMEOUT RÍGIDO (CLAUDE & GEMINI COM MODELOS ATUAIS)
// ─────────────────────────────────────────────────────────────────────────────
const LLM_TIMEOUT_MS = 9000; // 9 segundos para permitir respostas ricas e naturais

// Modelos Anthropic com foco em custo mínimo: Claude 3.5 Haiku como primário
const CLAUDE_MODELS = [
  'claude-3-5-haiku-20241022',
  'claude-3-haiku-20240307',
  'claude-3-5-sonnet-20241022',
  'claude-3-7-sonnet-20250219',
];

export async function generateClaudeResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string | null> {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!anthropicApiKey) return null;

  try {
    const Anthropic = (await import('@anthropic-ai/sdk')).default;
    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    // REGRA 11: Gestão de janela de contexto (últimas 8 mensagens formatadas)
    const recentMessages = conversationHistory.slice(-8).map((m) => ({
      role: m.sender_type === 'customer' ? ('user' as const) : ('assistant' as const),
      content: m.content,
    }));

    // Tentar modelos suportados com fallback em cascata (Haiku primeiro para economia máxima)
    for (const model of CLAUDE_MODELS) {
      try {
        const responsePromise = anthropic.messages.create({
          model,
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
        if (textBlock?.text) {
          return textBlock.text.trim();
        }
      } catch (err: any) {
        if (err?.status === 404) {
          // Modelo não disponível na conta, tenta o próximo
          continue;
        }
        console.error(`Erro no modelo ${model}:`, err.message);
        break;
      }
    }

    return null;
  } catch (err: any) {
    console.error('Erro geral Anthropic Claude:', err.message);
    return null;
  }
}

export async function generateGeminiResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string | null> {
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  if (!geminiApiKey) return null;

  // Lista de modelos Gemini modernos com cota gratuita (1.500 req/dia no Google AI Studio)
  const GEMINI_MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
  ];

  const recentHistory = conversationHistory.slice(-6).map((m) => ({
    role: m.sender_type === 'customer' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));

  for (const model of GEMINI_MODELS) {
    try {
      const fetchPromise = fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              ...recentHistory,
              {
                role: 'user',
                parts: [{ text: userMessage }],
              },
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 450,
            },
          }),
        }
      );

      const timeoutPromise = new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('LLM_TIMEOUT')), LLM_TIMEOUT_MS)
      );

      const res = await Promise.race([fetchPromise, timeoutPromise]);
      if (!res.ok) {
        // Fallback simples sem systemInstruction se o endpoint rejeitar
        try {
          const fallbackFetch = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
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
          if (fallbackFetch.ok) {
            const fbData = await fallbackFetch.json();
            const text = fbData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (text) return text;
          }
        } catch {
          // Ignora
        }
        continue;
      }
      const data = await res.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (candidateText) {
        return candidateText;
      }
    } catch (err: any) {
      console.error(`Tentativa com modelo ${model} falhou:`, err.message);
      continue;
    }
  }

  return null;
}

/**
 * Motor Groq: Llama 3.3 70B Versatile (Cota Gratuita Developer Tier, ultra-rápido ~300 tok/s)
 */
export async function generateGroqResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string | null> {
  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  if (!groqApiKey) return null;

  const GROQ_MODELS = [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
  ];

  const recentMessages = conversationHistory.slice(-6).map((m) => ({
    role: m.sender_type === 'customer' ? ('user' as const) : ('assistant' as const),
    content: m.content,
  }));

  for (const model of GROQ_MODELS) {
    try {
      const fetchPromise = fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...recentMessages,
            { role: 'user', content: userMessage },
          ],
          temperature: 0.6,
          max_tokens: 450,
        }),
      });

      const timeoutPromise = new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('LLM_TIMEOUT')), LLM_TIMEOUT_MS)
      );

      const res = await Promise.race([fetchPromise, timeoutPromise]);
      if (!res.ok) {
        console.error(`Groq erro HTTP ${res.status} no modelo ${model}`);
        continue;
      }
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) return content;
    } catch (err: any) {
      console.error(`Tentativa Groq modelo ${model} falhou:`, err.message);
      continue;
    }
  }

  return null;
}

/**
 * Motor DeepSeek: DeepSeek-V3 (Custo de centavos: $0.14 / 1M tokens, qualidade padrão GPT-4o)
 */
export async function generateDeepSeekResponse(
  systemPrompt: string,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<string | null> {
  const deepseekApiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!deepseekApiKey) return null;

  const recentMessages = conversationHistory.slice(-6).map((m) => ({
    role: m.sender_type === 'customer' ? ('user' as const) : ('assistant' as const),
    content: m.content,
  }));

  try {
    const fetchPromise = fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentMessages,
          { role: 'user', content: userMessage },
        ],
        temperature: 0.6,
        max_tokens: 450,
      }),
    });

    const timeoutPromise = new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('LLM_TIMEOUT')), LLM_TIMEOUT_MS)
    );

    const res = await Promise.race([fetchPromise, timeoutPromise]);
    if (!res.ok) {
      console.error(`DeepSeek erro HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    if (content) return content;
  } catch (err: any) {
    console.error('Tentativa DeepSeek falhou:', err.message);
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// REGRA 12 & 24: MOTOR PRINCIPAL COM FILTRO DE CONFIANÇA E CASCATA DE MÍNIMO CUSTO
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
  modelPreference: 'auto' | 'gemini' | 'groq' | 'deepseek' | 'claude_haiku' | 'claude_sonnet' | 'claude' = 'auto'
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

  // 3. Consulta Inteligente ao Catálogo / Base de Conhecimento RAG (Regras 16 e 24)
  const relevantKnowledge = searchKnowledgeBase(userMessage, knowledgeItems);
  const systemPrompt = buildSystemPrompt(attendant, relevantKnowledge);

  // 4. Chamada de IA com Cascata Inteligente de Mínimo Custo (Zero Custo -> Baixo Custo -> Alta Performance)
  let aiContent: string | null = null;
  let modelUsed = 'none';

  // Se houver preferência explícita configurada pelo cliente/organização
  if (modelPreference === 'groq' && process.env.GROQ_API_KEY) {
    aiContent = await generateGroqResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'groq-llama-3.3-70b';
  } else if (modelPreference === 'deepseek' && process.env.DEEPSEEK_API_KEY) {
    aiContent = await generateDeepSeekResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'deepseek-v3';
  } else if ((modelPreference === 'claude_haiku' || modelPreference === 'claude') && process.env.ANTHROPIC_API_KEY) {
    aiContent = await generateClaudeResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'claude-3-5-haiku';
  }

  // CASCATA DE BAIXO CUSTO (Zero Custo -> Centavos -> Fallback):
  // 1. Google Gemini 2.5 Flash (1.500 requisições/dia 100% GRÁTIS no Google AI Studio)
  if (!aiContent && process.env.GEMINI_API_KEY) {
    aiContent = await generateGeminiResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'gemini-2.5-flash';
  }

  // 2. Groq Llama 3.3 70B (Tier Desenvolvedor Grátis, ultra-rápido ~300 tok/s)
  if (!aiContent && process.env.GROQ_API_KEY) {
    aiContent = await generateGroqResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'groq-llama-3.3-70b';
  }

  // 3. DeepSeek V3 (Modelo chinês de altíssima qualidade e custo de centavos: $0.14 / 1M tokens)
  if (!aiContent && process.env.DEEPSEEK_API_KEY) {
    aiContent = await generateDeepSeekResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'deepseek-v3';
  }

  // 4. Claude 3.5 Haiku (Fallback Anthropic com 75% de economia em relação ao Sonnet)
  if (!aiContent && process.env.ANTHROPIC_API_KEY) {
    aiContent = await generateClaudeResponse(systemPrompt, userMessage, conversationHistory);
    if (aiContent) modelUsed = 'claude-3-5-haiku';
  }

  // 5. Se o modelo LLM respondeu com sucesso
  if (aiContent) {
    return {
      content: aiContent,
      shouldHandover: false,
      confidence: 0.98,
      modelUsed,
      ragItemsUsed: relevantKnowledge,
      promptSent: systemPrompt,
    };
  }

  // 6. Fallback Humanizado (Caso as APIs de IA estejam temporariamente instáveis)
  if (relevantKnowledge.length > 0) {
    const topItem = relevantKnowledge[0];
    return {
      content: `Oi! 😊 Sobre isso:\n\n${topItem.answer}\n\nFicou claro ou posso te explicar mais algum detalhe?`,
      shouldHandover: false,
      confidence: 0.85,
      modelUsed: 'rag_humanized_fallback',
      ragItemsUsed: [topItem],
      promptSent: systemPrompt,
      isFallback: true,
    };
  }

  const attendantGreetingName = attendant.name && !attendant.name.toLowerCase().includes('virtual')
    ? attendant.name
    : 'equipe';

  return {
    content: `Olá! Tudo bem? 😊 Aqui é do atendimento da ${attendantGreetingName}.\n\nComo posso te ajudar hoje?`,
    shouldHandover: false,
    confidence: 0.75,
    modelUsed: 'system_humanized_fallback',
    ragItemsUsed: [],
    promptSent: systemPrompt,
    isFallback: true,
  };
}
