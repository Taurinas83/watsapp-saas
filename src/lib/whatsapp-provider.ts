import { WhatsAppStatus } from '@/types';

export interface WhatsAppService {
  getStatus(): Promise<{ status: WhatsAppStatus; phone?: string; qrCode?: string }>;
  connect(): Promise<{ qrCode: string }>;
  disconnect(): Promise<boolean>;
  sendMessage(toPhone: string, text: string): Promise<boolean>;
}

export class EvolutionWhatsAppService implements WhatsAppService {
  private apiUrl: string;
  private apiKey: string;
  private instanceName: string;

  constructor(instanceName: string = 'default') {
    this.apiUrl = process.env.EVOLUTION_API_URL || '';
    this.apiKey = process.env.EVOLUTION_API_KEY || '';
    this.instanceName = instanceName;
  }

  async getStatus(): Promise<{ status: WhatsAppStatus; phone?: string; qrCode?: string }> {
    if (!this.apiUrl || !this.apiKey) {
      return { status: 'disconnected' };
    }
    try {
      const res = await fetch(`${this.apiUrl}/instance/connectionState/${this.instanceName}`, {
        headers: { apikey: this.apiKey }
      });
      const data = await res.json();
      if (data?.instance?.state === 'open') {
        return { status: 'connected', phone: data?.instance?.owner };
      }
      return { status: 'disconnected' };
    } catch {
      return { status: 'disconnected' };
    }
  }

  async connect(): Promise<{ qrCode: string }> {
    if (!this.apiUrl) {
      return { qrCode: 'mock-qr-code-payload' };
    }
    const res = await fetch(`${this.apiUrl}/instance/connect/${this.instanceName}`, {
      headers: { apikey: this.apiKey }
    });
    const data = await res.json();
    return { qrCode: data?.code || data?.base64 || '' };
  }

  async disconnect(): Promise<boolean> {
    if (!this.apiUrl) return true;
    await fetch(`${this.apiUrl}/instance/logout/${this.instanceName}`, {
      method: 'DELETE',
      headers: { apikey: this.apiKey }
    });
    return true;
  }

  async sendMessage(toPhone: string, text: string): Promise<boolean> {
    if (!this.apiUrl) return true;
    const res = await fetch(`${this.apiUrl}/message/sendText/${this.instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: this.apiKey
      },
      body: JSON.stringify({
        number: toPhone,
        text: text
      })
    });
    return res.ok;
  }
}
