import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

const rawUrl = process.env.EVOLUTION_API_URL || 'https://evolution-api-production-5589.up.railway.app';
const EVOLUTION_URL = rawUrl.trim().replace(/\/+$/, '');
const rawKey = process.env.EVOLUTION_API_KEY || 'e5039cbd79c8df9f44f542e9bf4b21bc3ae9a1f191647979f80697888a5a2360';
const EVOLUTION_KEY = rawKey.trim();

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const instanceName = req.nextUrl.searchParams.get('instance') || 'default_org';

    // Consultar grupos na Evolution API
    const res = await fetch(`${EVOLUTION_URL}/group/fetchAllGroups/${instanceName}?getParticipants=false`, {
      headers: {
        apikey: EVOLUTION_KEY,
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.error(`Evolution API fetchAllGroups retornou status ${res.status}`);
      return NextResponse.json({ groups: [] });
    }

    const data = await res.json().catch(() => []);
    const groups = Array.isArray(data)
      ? data.map((g: any) => ({
          id: g.id || g.jid,
          subject: g.subject || g.name || 'Grupo sem nome',
          size: g.size || g.participants?.length || 0,
        }))
      : [];

    return NextResponse.json({ groups });
  } catch (err: any) {
    console.error('Erro ao buscar grupos do WhatsApp:', err.message);
    return NextResponse.json({ groups: [], error: err.message }, { status: 500 });
  }
}
