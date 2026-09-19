import { Attendant, KnowledgeItem, Message } from '@/types';

/**
 * Constrói o Prompt do Sistema dinamicamente com base nas configurações da empresa
 */
export function buildSystemPrompt(
  attendant: Attendant,
  relevantKnowledge: KnowledgeItem[]
): string {
  const personalityStyles: Record<string, string> = {
    friendly: 'Você é extremamente amigável, caloroso, simpático, usa emojis moderados com empatia e entusiasmo.',
    professional: 'Você é profissional, educado, claro, objetivo, elegante e altamente eficiente.',
    casual: 'Você é descontraído, moderno, fala de forma natural e leve, sem formalidades excessivas.'
  };

  const styleDescription = personalityStyles[attendant.personality] || personalityStyles.professional;

  let knowledgeSection = '';
  if (relevantKnowledge.length > 0) {
    knowledgeSection = `\n--- BASE DE CONHECIMENTO DISPONÍVEL ---\nUtilize prioritariamente as informações abaixo para responder a dúvidas específicas do cliente:\n` +
      relevantKnowledge.map((item, idx) => `[Item ${idx + 1} - ${item.category.toUpperCase()}]\nPergunta Comum: ${item.question}\nResposta Oficial: ${item.answer}`).join('\n\n') +
      `\n---------------------------------------\n`;
  } else {
    knowledgeSection = `\n--- BASE DE CONHECIMENTO ---\nNenhuma informação específica encontrada na base de conhecimento para este contexto. Caso não saiba com certeza, responda gentilmente oferecendo transferir para a equipe de atendimento.\n`;
  }

  return `Você é ${attendant.name}, atendente virtual oficial via WhatsApp do negócio.

${styleDescription}

- Tom de voz: ${attendant.voice_tone || 'Atencioso e prestativo'}
- Informações sobre o Negócio: ${attendant.business_info || 'Atendimento comercial via WhatsApp'}

INSTRUÇÕES PERSONALIZADAS DO CLIENTE:
${attendant.custom_instructions || 'Seja prestativo e forneça respostas objetivas.'}

${knowledgeSection}

REGRAS DE CONDUTA OBRIGATÓRIAS:
1. Responda em Português do Brasil com linguagem natural, formatada para leitura fácil no WhatsApp (linhas curtas, negritos estratégicos *exemplo*).
2. NUNCA invente preços ou horários que não estejam na Base de Conhecimento ou nas Informações do Negócio.
3. Mantenha o contexto da conversa.
4. Se o cliente demonstrar insatisfação grave ou pedir explicitamente para falar com uma pessoa humana, informe gentilmente que está transferindo a conversa para a equipe de atendimento.`;
}

/**
 * Busca itens na base de conhecimento relevantes para a mensagem do cliente
 */
export function searchKnowledgeBase(
  userQuery: string,
  knowledgeItems: KnowledgeItem[]
): KnowledgeItem[] {
  const queryLower = userQuery.toLowerCase().trim();
  const words = queryLower.split(/\s+/).filter(w => w.length > 2);

  const scored = knowledgeItems.map(item => {
    let score = 0;
    const qLower = item.question.toLowerCase();
    const aLower = item.answer.toLowerCase();

    if (qLower.includes(queryLower)) score += 10;
    if (aLower.includes(queryLower)) score += 5;

    words.forEach(word => {
      if (qLower.includes(word)) score += 3;
      if (aLower.includes(word)) score += 1;
    });

    return { item, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.item);
}

/**
 * Verifica se a mensagem engatilha a transferência para atendimento humano (Handover)
 */
export function checkHandoverTriggers(
  userMessage: string,
  recentHistory: Message[]
): { trigger: boolean; reason?: string } {
  const msgLower = userMessage.toLowerCase();

  const explicitHumanKeywords = [
    'falar com humano', 'falar com pessoa', 'atendente humano', 'falar com atendente',
    'quero um atendente', 'chamar atendente', 'pessoa de verdade', 'humano por favor',
    'falar com alguem', 'falar com gerente', 'falar com recepcionista'
  ];
  if (explicitHumanKeywords.some(kw => msgLower.includes(kw))) {
    return { trigger: true, reason: 'Solicitação explícita de atendimento humano' };
  }

  const dissatisfactionKeywords = [
    'reclamação', 'reclamacao', 'insatisfeito', 'péssimo', 'pessimo', 'horrível', 'horrivel',
    'vou ao procon', 'processar', 'odiei', 'lixo', 'cancelar contrato', 'gerente agora'
  ];
  if (dissatisfactionKeywords.some(kw => msgLower.includes(kw))) {
    return { trigger: true, reason: 'Insatisfação ou reclamação detectada' };
  }

  return { trigger: false };
}

/**
 * Chamada à API da Google Gemini (IA Gratuita para o Plano Starter)
 */
export async function generateGeminiResponse(
  systemPrompt: string,
  userMessage: string
): Promise<string | null> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) return null;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nMensagem do Cliente no WhatsApp: ${userMessage}` }] }
        ]
      })
    });

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (err) {
    console.error('Erro na API do Gemini:', err);
    return null;
  }
}

/**
 * Chamada à API da Anthropic Claude (IA Premium para o Plano Pro)
 */
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

    const historyFormatted = conversationHistory.slice(-20).map(m => ({
      role: m.sender_type === 'customer' ? ('user' as const) : ('assistant' as const),
      content: m.content
    }));

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        ...historyFormatted,
        { role: 'user' as const, content: userMessage }
      ]
    });

    const textBlock = response.content.find(c => c.type === 'text');
    return textBlock?.text || null;
  } catch (err) {
    console.error('Erro na API da Anthropic Claude:', err);
    return null;
  }
}

/**
 * Função principal do Cérebro da IA (Suporta Claude IA e Gemini IA)
 */
export async function generateBotResponse(
  userMessage: string,
  attendant: Attendant,
  knowledgeItems: KnowledgeItem[],
  conversationHistory: Message[] = [],
  modelPreference: 'claude' | 'gemini' = 'claude'
): Promise<{ content: string; shouldHandover: boolean; handoverReason?: string }> {

  // 1. Verificar gatilhos de escalonamento (Handover)
  const handover = checkHandoverTriggers(userMessage, conversationHistory);
  if (handover.trigger) {
    return {
      content: `Entendido! Estou transferindo a sua conversa para um de nossos atendentes da equipe. Em instantes uma pessoa física irá te responder aqui mesmo! 😊`,
      shouldHandover: true,
      handoverReason: handover.reason
    };
  }

  // 2. Consultar Base de Conhecimento (RAG)
  const relevantKnowledge = searchKnowledgeBase(userMessage, knowledgeItems);
  const systemPrompt = buildSystemPrompt(attendant, relevantKnowledge);

  // 3. Tentar primeiro o modelo preferido (Claude ou Gemini)
  if (modelPreference === 'claude' || !process.env.GEMINI_API_KEY) {
    const claudeText = await generateClaudeResponse(systemPrompt, userMessage, conversationHistory);
    if (claudeText) return { content: claudeText, shouldHandover: false };
  }

  const geminiText = await generateGeminiResponse(systemPrompt, userMessage);
  if (geminiText) return { content: geminiText, shouldHandover: false };

  // Fallback com base de conhecimento local
  if (relevantKnowledge.length > 0) {
    const top = relevantKnowledge[0];
    const greeting = attendant.personality === 'friendly' ? 'Olá! 😊 ' : 'Olá! ';
    return {
      content: `${greeting}${top.answer}`,
      shouldHandover: false
    };
  }

  const defaultReply = attendant.personality === 'friendly'
    ? `Olá! Obrigado por escrever para a ${attendant.name || 'nossa equipe'}. Como posso te ajudar hoje?`
    : `Olá! Como posso ajudar você hoje?`;

  return {
    content: defaultReply,
    shouldHandover: false
  };
}
