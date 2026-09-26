import { NextRequest, NextResponse } from 'next/server';

const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET || 'zapella_internal_2024';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * POST /api/transcribe-audio
 * Endpoint interno para transcrição de áudio usando Groq Whisper-large-v3.
 * Chamado apenas pelo webhook do WhatsApp — protegido por header secreto.
 *
 * Body: { audioUrl: string }
 * Returns: { transcript: string } | { error: string }
 */
export async function POST(req: NextRequest) {
  // Proteção: apenas chamadas internas (do webhook)
  const internalSecret = req.headers.get('x-internal-secret');
  if (internalSecret !== INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let audioUrl: string;
  try {
    const body = await req.json();
    audioUrl = body?.audioUrl;
    if (!audioUrl) throw new Error('audioUrl obrigatório');
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Tentativa 1: Groq Whisper-large-v3 (gratuito, ultra-rápido)
  if (GROQ_API_KEY) {
    try {
      const transcript = await transcribeWithGroq(audioUrl);
      if (transcript) {
        return NextResponse.json({ transcript, provider: 'groq_whisper' });
      }
    } catch (err: any) {
      console.error('[STT] Groq Whisper falhou:', err.message);
    }
  }

  // Tentativa 2: OpenAI Whisper (fallback pago, opcional)
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const transcript = await transcribeWithOpenAI(audioUrl, openaiKey);
      if (transcript) {
        return NextResponse.json({ transcript, provider: 'openai_whisper' });
      }
    } catch (err: any) {
      console.error('[STT] OpenAI Whisper falhou:', err.message);
    }
  }

  return NextResponse.json({ error: 'Transcrição indisponível', transcript: null }, { status: 503 });
}

async function transcribeWithGroq(audioUrl: string): Promise<string | null> {
  if (!GROQ_API_KEY) return null;

  // 1. Baixar o arquivo de áudio com timeout
  const audioRes = await fetch(audioUrl, { signal: AbortSignal.timeout(10000) });
  if (!audioRes.ok) throw new Error(`Falha ao baixar áudio: HTTP ${audioRes.status}`);

  const audioBuffer = await audioRes.arrayBuffer();
  const audioBlob = new Blob([audioBuffer], { type: 'audio/ogg' });

  // 2. Montar multipart/form-data para o endpoint Groq
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.ogg');
  formData.append('model', 'whisper-large-v3');
  formData.append('language', 'pt');
  formData.append('response_format', 'json');

  // 3. Chamar API Groq Whisper
  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: formData,
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq API erro ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text = data?.text?.trim();
  return text || null;
}

async function transcribeWithOpenAI(audioUrl: string, apiKey: string): Promise<string | null> {
  const audioRes = await fetch(audioUrl, { signal: AbortSignal.timeout(10000) });
  if (!audioRes.ok) throw new Error(`Falha ao baixar áudio: HTTP ${audioRes.status}`);

  const audioBuffer = await audioRes.arrayBuffer();
  const audioBlob = new Blob([audioBuffer], { type: 'audio/ogg' });

  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.ogg');
  formData.append('model', 'whisper-1');
  formData.append('language', 'pt');
  formData.append('response_format', 'json');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) throw new Error(`OpenAI Whisper erro ${res.status}`);
  const data = await res.json();
  return data?.text?.trim() || null;
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/transcribe-audio',
    provider: GROQ_API_KEY ? 'groq_whisper_large_v3' : 'not_configured',
    description: 'Endpoint interno para transcrição de áudio WhatsApp via Groq Whisper',
  });
}
