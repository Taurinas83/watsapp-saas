import { createClient } from '@/lib/supabase/client';
import { DEFAULT_ORG_ID } from '@/lib/constants';

/**
 * Normaliza o ID da organização a partir do nome da instância na Evolution API.
 * Ex: 'default_org' -> DEFAULT_ORG_ID
 * Ex: 'org_a0000000_0000_0000_0000_000000000001' -> 'a0000000-0000-0000-0000-000000000001'
 */
export function getOrgIdFromInstance(instanceName: string): string {
  if (!instanceName || instanceName === 'default_org') {
    return DEFAULT_ORG_ID;
  }
  if (instanceName.startsWith('org_')) {
    const raw = instanceName.replace('org_', '');
    // Se for UUID formatado com underscores, converte para hífens
    if (raw.length === 36 && raw.includes('_')) {
      return raw.replace(/_/g, '-');
    }
    // Ou se já tiver outro padrão UUID
    return raw.replace(/_/g, '-');
  }
  return instanceName;
}

/**
 * Converte o ID de uma organização para o nome padrão de instância da Evolution API.
 */
export function getInstanceName(orgId: string | null): string {
  if (!orgId || orgId === DEFAULT_ORG_ID) {
    return 'default_org';
  }
  return `org_${orgId.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

/**
 * Atualiza o status do WhatsApp no Supabase (tabela attendants) de forma segura via RPC.
 */
export async function syncWhatsAppStatusToDb(
  instanceOrOrgId: string,
  status: 'connected' | 'disconnected' | 'connecting',
  phone?: string | null
): Promise<void> {
  try {
    const orgId = instanceOrOrgId.includes('-') && !instanceOrOrgId.startsWith('org_')
      ? instanceOrOrgId
      : getOrgIdFromInstance(instanceOrOrgId);

    const supabase = createClient();
    const { error } = await supabase.rpc('update_whatsapp_status', {
      p_org_id: orgId,
      p_status: status,
      p_phone: phone || null,
    });

    if (error) {
      console.error(`[WhatsApp Sync] Erro ao sincronizar status para org ${orgId}:`, error);
    } else {
      console.log(`[WhatsApp Sync] Org ${orgId} atualizada para ${status}${phone ? ` (${phone})` : ''}`);
    }
  } catch (err) {
    console.error('[WhatsApp Sync] Exceção ao sincronizar status:', err);
  }
}
