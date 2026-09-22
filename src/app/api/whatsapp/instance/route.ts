import { NextRequest, NextResponse } from 'next/server';

const rawUrl = process.env.EVOLUTION_API_URL || 'https://evolution-api-production-5589.up.railway.app';
const EVOLUTION_URL = rawUrl.trim().replace(/\/+$/, '');
const rawKey = process.env.EVOLUTION_API_KEY || 'e5039cbd79c8df9f44f542e9bf4b21bc3ae9a1f191647979f80697888a5a2360';
const EVOLUTION_KEY = rawKey.trim();

// Timeout for all Evolution API requests (the server is slow)
const API_TIMEOUT = 60000; // 60 seconds

async function evoFetch(path: string, options: RequestInit = {}): Promise<Response | null> {
  try {
    const res = await fetch(`${EVOLUTION_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers as Record<string, string>,
        apikey: EVOLUTION_KEY,
      },
      signal: AbortSignal.timeout(API_TIMEOUT),
    });
    return res;
  } catch (e) {
    console.error(`Evolution API error for ${path}:`, e);
    return null;
  }
}

async function ensureWebhookConfigured(instanceName: string, req: NextRequest) {
  const host = req.headers.get('host') || 'watsapp-saas.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const webhookUrl = `${protocol}://${host}/api/whatsapp/webhook`;

  await evoFetch(`/webhook/set/${instanceName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      webhook: {
        enabled: true,
        url: webhookUrl,
        byEvents: false,
        base64: false,
        events: ['MESSAGES_SET', 'MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
      }
    })
  });
}

export async function GET(req: NextRequest) {
  try {
    const instanceName = req.nextUrl.searchParams.get('instance') || 'default_org';

    // Fetch full instance details from Evolution API
    const instRes = await evoFetch(`/instance/fetchInstances?instanceName=${instanceName}`);

    if (!instRes || !instRes.ok) {
      return NextResponse.json({ status: 'disconnected', serverOffline: !instRes });
    }

    const instances = await instRes.json().catch(() => []);
    const inst = Array.isArray(instances) ? instances.find(i => i.name === instanceName) || instances[0] : instances;

    if (!inst) {
      return NextResponse.json({ status: 'disconnected' });
    }

    // Check for mobile disconnection (conflict 401 or device_removed)
    const isConflict =
      inst.disconnectionReasonCode === 401 ||
      (typeof inst.disconnectionObject === 'string' && inst.disconnectionObject.includes('device_removed'));

    if (inst.connectionStatus === 'open' && !isConflict) {
      // Ensure webhook is configured (fire and forget)
      ensureWebhookConfigured(instanceName, req).catch(() => null);

      const rawNumber = inst.ownerJid ? inst.ownerJid.split('@')[0] : '';
      let formattedPhone = rawNumber ? `+${rawNumber}` : 'WhatsApp Conectado';

      if (rawNumber && rawNumber.length >= 12) {
        const country = rawNumber.slice(0, 2);
        const ddd = rawNumber.slice(2, 4);
        const rest = rawNumber.slice(4);
        const part1 = rest.length === 9 ? rest.slice(0, 5) : rest.slice(0, 4);
        const part2 = rest.length === 9 ? rest.slice(5) : rest.slice(4);
        formattedPhone = `+${country} (${ddd}) ${part1}-${part2}`;
      }

      return NextResponse.json({
        status: 'connected',
        phone: formattedPhone,
        rawPhone: rawNumber,
        profileName: inst.profileName || 'Usuário Conectado',
        profilePicUrl: inst.profilePicUrl || null,
        messageCount: inst._count?.Message || 0,
      });
    }

    return NextResponse.json({ status: 'disconnected' });
  } catch (err: any) {
    console.error('Erro ao buscar status da Evolution API:', err);
    return NextResponse.json({ status: 'disconnected', error: err.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, instanceName = 'default_org', phone } = body;

    if (action === 'connect') {
      let qrCodeBase64: string | null = null;
      let pairingCode: string | null = null;

      // 1. Try to connect existing instance
      const connectUrl = phone
        ? `/instance/connect/${instanceName}?number=${phone.replace(/\D/g, '')}`
        : `/instance/connect/${instanceName}`;

      const connectRes = await evoFetch(connectUrl);

      if (connectRes) {
        const connectData = await connectRes.json().catch(() => null);
        qrCodeBase64 = connectData?.base64 || connectData?.qrcode?.base64 || connectData?.code || null;
        pairingCode = connectData?.pairingCode || connectData?.qrcode?.pairingCode || null;
      }

      // 2. If no QR code and no pairing code, the instance is either in a zombie state or doesn't exist.
      // Clean up stale instance and recreate cleanly.
      if (!qrCodeBase64 && !pairingCode) {
        console.warn(`[WhatsApp] Instance ${instanceName} did not return QR code on connect. Forcing clean recreation...`);

        // Purge old zombie instance
        await evoFetch(`/instance/logout/${instanceName}`, { method: 'DELETE' });
        await evoFetch(`/instance/delete/${instanceName}`, { method: 'DELETE' });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const host = req.headers.get('host') || 'www.zapella.app';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const webhookUrl = `${protocol}://${host}/api/whatsapp/webhook`;

        const createRes = await evoFetch('/instance/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instanceName,
            qrcode: true,
            integration: 'WHATSAPP-BAILEYS',
            webhook: {
              url: webhookUrl,
              byEvents: false,
              base64: false,
              events: ['MESSAGES_SET', 'MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
            }
          })
        });

        if (createRes) {
          const createData = await createRes.json().catch(() => null);
          qrCodeBase64 = createData?.qrcode?.base64 || createData?.base64 || createData?.code || null;
          pairingCode = createData?.qrcode?.pairingCode || createData?.pairingCode || null;
        }

        // 3. If still no QR, try connect after create
        if (!qrCodeBase64 && !pairingCode) {
          const retryRes = await evoFetch(connectUrl);
          if (retryRes) {
            const retryData = await retryRes.json().catch(() => null);
            qrCodeBase64 = retryData?.base64 || retryData?.qrcode?.base64 || retryData?.code || null;
            pairingCode = retryData?.pairingCode || retryData?.qrcode?.pairingCode || null;
          }
        }
      }

      if (!qrCodeBase64 && !pairingCode) {
        return NextResponse.json({
          status: 'error',
          message: 'Não foi possível gerar o QR Code no servidor de WhatsApp. Clique em "Reiniciar Conexão" para tentar novamente.'
        }, { status: 400 });
      }

      // Set webhook after connection attempt
      ensureWebhookConfigured(instanceName, req).catch(() => null);

      return NextResponse.json({
        status: 'connecting',
        qrCode: qrCodeBase64,
        pairingCode: pairingCode
      });
    }

    if (action === 'disconnect') {
      await evoFetch(`/instance/logout/${instanceName}`, { method: 'DELETE' });
      await evoFetch(`/instance/delete/${instanceName}`, { method: 'DELETE' });
      return NextResponse.json({ status: 'disconnected' });
    }

    if (action === 'restart') {
      // Delete and recreate the instance
      await evoFetch(`/instance/logout/${instanceName}`, { method: 'DELETE' });
      await evoFetch(`/instance/delete/${instanceName}`, { method: 'DELETE' });

      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 2000));

      const host = req.headers.get('host') || 'www.zapella.app';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      const webhookUrl = `${protocol}://${host}/api/whatsapp/webhook`;

      // Recreate
      const createRes = await evoFetch('/instance/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instanceName,
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
          webhook: {
            url: webhookUrl,
            byEvents: false,
            base64: false,
            events: ['MESSAGES_SET', 'MESSAGES_UPSERT', 'MESSAGES_UPDATE', 'SEND_MESSAGE', 'CONNECTION_UPDATE']
          }
        })
      });

      let qrCode: string | null = null;
      let pairingCode: string | null = null;

      if (createRes) {
        const createData = await createRes.json().catch(() => null);
        qrCode = createData?.qrcode?.base64 || createData?.base64 || createData?.code || null;
        pairingCode = createData?.qrcode?.pairingCode || createData?.pairingCode || null;
      }

      if (!qrCode && !pairingCode) {
        const connectRes = await evoFetch(`/instance/connect/${instanceName}`);
        if (connectRes) {
          const connectData = await connectRes.json().catch(() => null);
          qrCode = connectData?.base64 || connectData?.qrcode?.base64 || connectData?.code || null;
          pairingCode = connectData?.pairingCode || connectData?.qrcode?.pairingCode || null;
        }
      }

      return NextResponse.json({
        status: 'connecting',
        qrCode,
        pairingCode,
        message: 'Instância recriada com sucesso. Escaneie o QR Code.'
      });
    }

    return NextResponse.json({ error: 'Ação inválida. Use: connect, disconnect, restart' }, { status: 400 });
  } catch (err: any) {
    console.error('Erro ao conectar com Evolution API:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
