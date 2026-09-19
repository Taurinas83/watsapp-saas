import { NextRequest, NextResponse } from 'next/server';
import { generateBotResponse } from '@/lib/ai-engine';
import { initialAttendant, initialKnowledgeItems } from '@/lib/mock-data';
import { Attendant, KnowledgeItem, Message } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userMessage, conversationId, organizationId, history = [] } = body;

    if (!userMessage) {
      return NextResponse.json({ error: 'userMessage é obrigatório' }, { status: 400 });
    }

    // Tentar carregar dados da empresa e base de conhecimento (fallback para inicial se local)
    const attendant: Attendant = body.attendant || initialAttendant;
    const knowledgeItems: KnowledgeItem[] = body.knowledgeItems || initialKnowledgeItems;
    const conversationHistory: Message[] = history;

    // Gerar resposta da IA via Anthropic Claude + RAG + Handover
    const result = await generateBotResponse(
      userMessage,
      attendant,
      knowledgeItems,
      conversationHistory
    );

    return NextResponse.json({
      success: true,
      response: result.content,
      shouldHandover: result.shouldHandover,
      handoverReason: result.handoverReason,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Erro na API da IA:', error);
    return NextResponse.json({ error: error.message || 'Erro interno na IA' }, { status: 500 });
  }
}
