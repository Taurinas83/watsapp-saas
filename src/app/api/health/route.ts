import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_ORG_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Health Check / Diagnostic Endpoint
 * Tests the full pipeline: Supabase, Evolution API, and AI engine
 * GET /api/health — returns system status
 * GET /api/health?test=webhook — simulates a webhook call to test the pipeline
 */
export async function GET(req: NextRequest) {
  const testMode = req.nextUrl.searchParams.get('test');
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
  };

  // 1. Check Supabase
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);
    results.supabase = {
      status: error ? 'error' : 'ok',
      error: error?.message || null,
      hasData: !!data && data.length > 0,
    };
  } catch (e: any) {
    results.supabase = { status: 'error', error: e.message };
  }

  // 2. Check Environment Variables
  results.envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    EVOLUTION_API_URL: process.env.EVOLUTION_API_URL || 'NOT SET',
    EVOLUTION_API_KEY: !!process.env.EVOLUTION_API_KEY,
  };

  const rawUrl = process.env.EVOLUTION_API_URL || 'https://evolution-api-production-5589.up.railway.app';
  const evolutionUrl = rawUrl.trim().replace(/\/+$/, '');
  const rawKey = process.env.EVOLUTION_API_KEY || 'e5039cbd79c8df9f44f542e9bf4b21bc3ae9a1f191647979f80697888a5a2360';
  const evolutionKey = rawKey.trim();

  try {
    const evoRes = await fetch(
      `${evolutionUrl}/instance/connectionState/default_org`,
      {
        headers: { apikey: evolutionKey },
        signal: AbortSignal.timeout(15000),
      }
    );
    const evoData = await evoRes.json();
    results.evolutionApi = {
      status: 'ok',
      connectionState: evoData?.instance?.state || 'unknown',
      responseTime: 'within 15s',
    };
  } catch (e: any) {
    results.evolutionApi = {
      status: 'error',
      error: e.name === 'TimeoutError' ? 'Timeout (>15s) - server too slow' : e.message,
    };
  }

  // 4. Check webhook configuration
  try {
    const whRes = await fetch(
      `${evolutionUrl}/webhook/find/default_org`,
      {
        headers: { apikey: evolutionKey },
        signal: AbortSignal.timeout(15000),
      }
    );
    const whData = await whRes.json();
    results.webhook = {
      status: 'ok',
      url: whData?.url || 'NOT SET',
      enabled: whData?.enabled ?? false,
      events: whData?.events || [],
    };
  } catch (e: any) {
    results.webhook = {
      status: 'error',
      error: e.name === 'TimeoutError' ? 'Timeout (>15s)' : e.message,
    };
  }

  // 5. If test mode, simulate webhook
  if (testMode === 'webhook') {
    try {
      const testPayload = {
        event: 'messages.upsert',
        instance: 'default_org',
        data: {
          key: {
            remoteJid: '5500000000000@s.whatsapp.net',
            fromMe: false,
          },
          pushName: 'Health Check Test',
          message: {
            conversation: `[HEALTH CHECK] Teste automático em ${new Date().toISOString()}`,
          },
        },
      };

      const host = req.headers.get('host') || 'watsapp-saas.vercel.app';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const webhookRes = await fetch(`${protocol}://${host}/api/whatsapp/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });
      const webhookResult = await webhookRes.json();
      results.webhookTest = {
        status: webhookRes.ok ? 'ok' : 'error',
        httpStatus: webhookRes.status,
        response: webhookResult,
      };
    } catch (e: any) {
      results.webhookTest = { status: 'error', error: e.message };
    }
  }

  // 6. Overall status
  const allOk =
    results.supabase?.status === 'ok' &&
    results.evolutionApi?.status === 'ok' &&
    results.evolutionApi?.connectionState === 'open';

  results.overall = allOk ? 'HEALTHY' : 'DEGRADED';

  return NextResponse.json(results);
}
