import { createClient } from '@/lib/supabase/client';
import { Organization, Profile, AdminAuditLog, Invoice, OrganizationStatus } from '@/types';
import { getInstanceName, syncWhatsAppStatusToDb } from '@/lib/whatsapp-sync';

/**
 * PLAN TIER PRICING CONSTANTS (MRR calculation fallback)
 */
export const PLAN_PRICES: Record<string, number> = {
  starter: 97.00,
  pro: 197.00,
  enterprise: 397.00,
};

/**
 * Super Admin Verification
 * Returns profile if user is a valid super admin, null otherwise.
 */
export async function getSuperAdminProfile(): Promise<Profile | null> {
  const supabase = createClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) return null;
    if (!profile.is_super_admin) return null;

    return profile as Profile;
  } catch (err) {
    console.error('Error verifying super admin:', err);
    return null;
  }
}

/**
 * Log Admin Action in admin_audit_logs
 */
export async function logAdminAction(
  action: string,
  targetType: string,
  targetId: string,
  details: Record<string, any> = {}
): Promise<boolean> {
  const supabase = createClient();
  try {
    const admin = await getSuperAdminProfile();
    if (!admin) return false;

    const { error } = await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: admin.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        ip_address: '127.0.0.1', // Captured on server/edge if needed
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      });

    if (error) {
      console.error('Failed to log admin action:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error logging admin action:', err);
    return false;
  }
}

export interface AIProviderStatus {
  id: 'gemini' | 'groq' | 'deepseek' | 'claude';
  name: string;
  model: string;
  role: 'primario' | 'secundario' | 'terciario' | 'fallback';
  status: 'active' | 'configured' | 'unconfigured';
  tier: string;
  costInfo: string;
  balance?: string;
}

export interface ResourceUsage {
  ai: {
    estimatedTokens: number;
    estimatedCostUsd: number;
    quotaLimitMonthly: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger';
    providers: AIProviderStatus[];
  };
  whatsapp: {
    connectedInstances: number;
    maxRecommendedInstances: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger';
  };
  database: {
    totalRecords: number;
    knowledgeVectorsCount: number;
    estimatedSizeMb: number;
    storageLimitMb: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger';
  };
  email: {
    sentThisMonth: number;
    quotaLimit: number;
    percentage: number;
    status: 'safe' | 'warning' | 'danger';
  };
  gateway: {
    asaasWebhookStatus: 'active' | 'pending';
    lastSync: string;
  };
}

export interface OverviewMetrics {
  mrr: number;
  activeClients: number;
  totalClients: number;
  suspendedClients: number;
  trialingClients: number;
  churnRate: number;
  totalMessages: number;
  messagesThisMonth: number;
  revenueHistory: { month: string; revenue: number; clients: number }[];
  recentLogs: AdminAuditLog[];
  resourceUsage: ResourceUsage;
}

/**
 * Fetch Overview Metrics for God Mode Dashboard
 */
export async function fetchAdminOverviewMetrics(): Promise<OverviewMetrics> {
  const supabase = createClient();

  // 1. Fetch all organizations
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name, plan_tier, status, custom_mrr, created_at');

  const organizations = (orgs || []) as Organization[];

  let mrr = 0;
  let activeClients = 0;
  let suspendedClients = 0;
  let trialingClients = 0;
  let canceledClients = 0;

  organizations.forEach((org) => {
    const status = org.status || 'active';
    if (status === 'active') {
      activeClients++;
      const tierPrice = PLAN_PRICES[org.plan_tier || 'starter'] || 97;
      const orgMrr = org.custom_mrr && org.custom_mrr > 0 ? Number(org.custom_mrr) : tierPrice;
      mrr += orgMrr;
    } else if (status === 'suspended') {
      suspendedClients++;
    } else if (status === 'trialing') {
      trialingClients++;
    } else if (status === 'canceled') {
      canceledClients++;
    }
  });

  const totalClients = organizations.length;
  const churnRate = totalClients > 0 ? Number(((canceledClients / totalClients) * 100).toFixed(1)) : 0.0;

  // 2. Fetch messages count
  const { count: totalMessages } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });

  // 3. Fetch messages this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: messagesThisMonth } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfMonth.toISOString());

  // 4. Fetch WhatsApp connected instances
  const { count: connectedInstances } = await supabase
    .from('attendants')
    .select('*', { count: 'exact', head: true })
    .eq('whatsapp_status', 'connected');

  // 5. Fetch knowledge vectors count
  const { count: knowledgeVectorsCount } = await supabase
    .from('knowledge_items')
    .select('*', { count: 'exact', head: true });

  // 6. Resource Usage & Quota Calculations
  const msgsMonth = messagesThisMonth || 0;
  const estimatedTokens = msgsMonth * 340; // Média de tokens por mensagem
  const estimatedCostUsd = Number(((estimatedTokens / 1_000_000) * 0.40).toFixed(2));
  const aiQuotaLimit = 2_000_000; // Limite de 2M tokens/mês no tier base
  const aiPercentage = Math.min(100, Math.round((estimatedTokens / aiQuotaLimit) * 100));

  const connCount = connectedInstances || 0;
  const maxRecommendedInstances = 25; // 25 instâncias por cada nó padrão da Evolution API
  const whatsappPercentage = Math.min(100, Math.round((connCount / maxRecommendedInstances) * 100));

  const totalRecords = (totalMessages || 0) + (knowledgeVectorsCount || 0) + totalClients;
  const estimatedSizeMb = Number(((totalRecords * 1.8) / 1024).toFixed(1)); // ~1.8KB por registro médio
  const storageLimitMb = 500; // Cota base Supabase
  const dbPercentage = Math.min(100, Math.round((estimatedSizeMb / storageLimitMb) * 100));

  const emailSent = totalClients * 4 + msgsMonth * 0.05; // Estimativa de e-mails transacionais
  const emailLimit = 3000;
  const emailPercentage = Math.min(100, Math.round((emailSent / emailLimit) * 100));

  // Consulta de saldo DeepSeek em tempo real
  let deepseekBalance: { total_balance: string; currency: string } | null = null;
  const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (deepseekKey) {
    try {
      const dsRes = await fetch('https://api.deepseek.com/user/balance', {
        headers: { Authorization: `Bearer ${deepseekKey}` },
        cache: 'no-store',
      });
      if (dsRes.ok) {
        const dsData = await dsRes.json();
        const info = dsData?.balance_infos?.[0];
        if (info) {
          deepseekBalance = {
            total_balance: info.total_balance || '0.00',
            currency: info.currency || 'USD',
          };
        }
      }
    } catch {
      // Ignora erro se timeout
    }
  }

  const aiProviders: AIProviderStatus[] = [
    {
      id: 'gemini',
      name: 'Google Gemini',
      model: 'gemini-2.5-flash',
      role: 'primario',
      status: process.env.GEMINI_API_KEY ? 'active' : 'unconfigured',
      tier: 'Free Tier (1.500 req/dia)',
      costInfo: 'R$ 0,00 (Gratuito)',
    },
    {
      id: 'groq',
      name: 'Groq Cloud',
      model: 'llama-3.3-70b-versatile',
      role: 'secundario',
      status: process.env.GROQ_API_KEY ? 'active' : 'unconfigured',
      tier: 'Developer Free Tier',
      costInfo: 'R$ 0,00 (~300 tok/s)',
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      model: 'deepseek-chat (V3)',
      role: 'terciario',
      status: process.env.DEEPSEEK_API_KEY ? 'active' : 'unconfigured',
      tier: deepseekBalance ? `Saldo: $${deepseekBalance.total_balance} ${deepseekBalance.currency}` : 'Saldo Pré-pago Ativo',
      balance: deepseekBalance ? `$${deepseekBalance.total_balance} ${deepseekBalance.currency}` : '$2.00 USD',
      costInfo: '$0.14 / 1M tokens (~R$ 0,80)',
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      model: 'claude-3-5-haiku-20241022',
      role: 'fallback',
      status: process.env.ANTHROPIC_API_KEY ? 'active' : 'unconfigured',
      tier: 'Haiku Econômico (75% off)',
      costInfo: '$0.80 / 1M tokens',
    },
  ];

  const resourceUsage: ResourceUsage = {
    ai: {
      estimatedTokens,
      estimatedCostUsd,
      quotaLimitMonthly: aiQuotaLimit,
      percentage: aiPercentage,
      status: aiPercentage > 85 ? 'danger' : aiPercentage > 65 ? 'warning' : 'safe',
      providers: aiProviders,
    },
    whatsapp: {
      connectedInstances: connCount,
      maxRecommendedInstances,
      percentage: whatsappPercentage,
      status: whatsappPercentage > 85 ? 'danger' : whatsappPercentage > 70 ? 'warning' : 'safe',
    },
    database: {
      totalRecords,
      knowledgeVectorsCount: knowledgeVectorsCount || 0,
      estimatedSizeMb,
      storageLimitMb,
      percentage: dbPercentage,
      status: dbPercentage > 85 ? 'danger' : dbPercentage > 70 ? 'warning' : 'safe',
    },
    email: {
      sentThisMonth: Math.round(emailSent),
      quotaLimit: emailLimit,
      percentage: emailPercentage,
      status: emailPercentage > 85 ? 'danger' : emailPercentage > 70 ? 'warning' : 'safe',
    },
    gateway: {
      asaasWebhookStatus: 'active',
      lastSync: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  };

  // 4. Fetch recent audit logs
  const { data: logsData } = await supabase
    .from('admin_audit_logs')
    .select(`
      id,
      admin_id,
      action,
      target_type,
      target_id,
      details,
      created_at,
      profiles:admin_id (full_name, email)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  const recentLogs: AdminAuditLog[] = (logsData || []).map((l: any) => ({
    id: l.id,
    admin_id: l.admin_id,
    admin_name: l.profiles?.full_name || 'Admin',
    admin_email: l.profiles?.email || '',
    action: l.action,
    target_type: l.target_type,
    target_id: l.target_id,
    details: l.details || {},
    created_at: l.created_at,
  }));

  // 5. Generate 6-month revenue progression
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const now = new Date();
  const revenueHistory = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `${monthNames[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`;
    // Estimate growth curve based on current MRR
    const factor = Math.max(0.4, 1 - (i * 0.12));
    revenueHistory.push({
      month: monthLabel,
      revenue: Math.round(mrr * factor),
      clients: Math.max(1, Math.round(activeClients * factor)),
    });
  }

  return {
    mrr,
    activeClients,
    totalClients,
    suspendedClients,
    trialingClients,
    churnRate,
    totalMessages: totalMessages || 0,
    messagesThisMonth: messagesThisMonth || 0,
    revenueHistory,
    recentLogs,
    resourceUsage,
  };
}

export interface TenantListItem extends Organization {
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string | null;
  profileId?: string;
  attendantConnected: boolean;
  messagesCount: number;
  trial_ends_at?: string | null;
  trialDaysLeft?: number | null;
}

/**
 * Fetch Tenants with Owners and Attendant Info for Admin Management
 */
export async function fetchAdminTenants(query?: string, statusFilter?: string): Promise<TenantListItem[]> {
  const supabase = createClient();

  let orgsQuery = supabase
    .from('organizations')
    .select(`
      id,
      name,
      phone,
      stripe_customer_id,
      stripe_subscription_status,
      created_at,
      plan_tier,
      ai_model_preference,
      status,
      suspended_reason,
      custom_mrr,
      billing_cycle,
      trial_ends_at,
      profiles (
        id,
        full_name,
        email,
        phone,
        role
      ),
      attendants (
        whatsapp_status
      )
    `)
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    orgsQuery = orgsQuery.eq('status', statusFilter);
  }

  const { data: rawOrgs, error } = await orgsQuery;
  if (error) {
    console.error('Error fetching admin tenants:', error);
    return [];
  }

  // Obter instâncias em tempo real da Evolution API para garantir precisão instantânea
  const liveInstancesMap = new Map<string, string>();
  try {
    const rawUrl = process.env.EVOLUTION_API_URL || 'https://evolution-api-production-5589.up.railway.app';
    const evoUrl = rawUrl.trim().replace(/\/+$/, '');
    const rawKey = process.env.EVOLUTION_API_KEY || 'e5039cbd79c8df9f44f542e9bf4b21bc3ae9a1f191647979f80697888a5a2360';
    const evoKey = rawKey.trim();

    const evoRes = await fetch(`${evoUrl}/instance/fetchInstances`, {
      headers: { apikey: evoKey },
      signal: AbortSignal.timeout(3000),
    });
    if (evoRes.ok) {
      const list = await evoRes.json();
      if (Array.isArray(list)) {
        for (const inst of list) {
          if (inst?.name) {
            liveInstancesMap.set(inst.name, inst.connectionStatus);
          }
        }
      }
    }
  } catch (e) {
    // Non-blocking: fallback suave para o status salvo no banco Supabase
  }

  const tenants: TenantListItem[] = (rawOrgs || []).map((item: any) => {
    const primaryProfile = Array.isArray(item.profiles)
      ? (item.profiles.length > 0 ? item.profiles[0] : null)
      : (item.profiles || null);

    const primaryAttendant = Array.isArray(item.attendants)
      ? (item.attendants.length > 0 ? item.attendants[0] : null)
      : (item.attendants || null);

    let trialDaysLeft: number | null = null;
    if (item.trial_ends_at) {
      const diff = new Date(item.trial_ends_at).getTime() - new Date().getTime();
      trialDaysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    const instanceName = getInstanceName(item.id);
    const liveStatus = liveInstancesMap.get(instanceName);
    const isLiveConnected = liveStatus === 'open';
    const isDbConnected = primaryAttendant?.whatsapp_status === 'connected';

    // Prioriza status da Evolution API se a lista foi retornada, senão usa o banco
    const attendantConnected = liveInstancesMap.size > 0
      ? isLiveConnected
      : isDbConnected;

    // Se houver discrepância entre a Evolution API e o banco de dados, sincroniza em background
    if (liveInstancesMap.size > 0 && isLiveConnected !== isDbConnected) {
      syncWhatsAppStatusToDb(item.id, isLiveConnected ? 'connected' : 'disconnected').catch(() => null);
    }

    return {
      id: item.id,
      name: item.name,
      stripe_customer_id: item.stripe_customer_id,
      stripe_subscription_status: item.stripe_subscription_status,
      created_at: item.created_at,
      plan_tier: item.plan_tier || 'starter',
      ai_model_preference: item.ai_model_preference,
      status: item.status || 'active',
      suspended_reason: item.suspended_reason,
      custom_mrr: item.custom_mrr || PLAN_PRICES[item.plan_tier || 'starter'] || 97,
      billing_cycle: item.billing_cycle || 'monthly',
      trial_ends_at: item.trial_ends_at,
      trialDaysLeft,
      profileId: primaryProfile?.id,
      ownerName: primaryProfile?.full_name || 'Não informado',
      ownerEmail: primaryProfile?.email || 'sem-email@zapella.com',
      ownerPhone: primaryProfile?.phone || item.phone || null,
      attendantConnected,
      messagesCount: 0, // Enriched if needed
    };
  });

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    return tenants.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.ownerName.toLowerCase().includes(q) ||
      t.ownerEmail.toLowerCase().includes(q) ||
      (t.ownerPhone && t.ownerPhone.includes(q))
    );
  }

  return tenants;
}

export interface UpdateTenantData {
  organizationId: string;
  organizationName: string;
  profileId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string | null;
  planTier: string;
  status: OrganizationStatus;
  customMrr?: number;
  trialEndsAt?: string | null;
  suspendedReason?: string | null;
}

/**
 * Super Admin: Update Complete Tenant & Owner Profile Info
 */
export async function updateTenantComplete(data: UpdateTenantData): Promise<boolean> {
  const supabase = createClient();
  try {
    const mrrValue = data.customMrr !== undefined ? data.customMrr : (PLAN_PRICES[data.planTier] || 97.00);

    // 1. Atualizar Organização
    const { error: orgError } = await supabase
      .from('organizations')
      .update({
        name: data.organizationName,
        phone: data.ownerPhone || null,
        plan_tier: data.planTier,
        status: data.status,
        custom_mrr: mrrValue,
        trial_ends_at: data.trialEndsAt || null,
        suspended_reason: data.status === 'suspended' ? (data.suspendedReason || 'Suspenso pelo Super Admin') : null,
      })
      .eq('id', data.organizationId);

    if (orgError) {
      console.error('Error updating organization:', orgError);
      return false;
    }

    // 2. Atualizar Perfil do Assinante se existir profileId
    if (data.profileId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.ownerName,
          email: data.ownerEmail,
          phone: data.ownerPhone || null,
        })
        .eq('id', data.profileId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }
    }

    // 3. Registrar Log de Auditoria
    await logAdminAction('tenant.complete_update', 'organization', data.organizationId, {
      name: data.organizationName,
      plan_tier: data.planTier,
      status: data.status,
      custom_mrr: mrrValue,
      trial_ends_at: data.trialEndsAt,
      owner_name: data.ownerName,
      owner_email: data.ownerEmail,
    });

    return true;
  } catch (err) {
    console.error('Error in updateTenantComplete:', err);
    return false;
  }
}

/**
 * Update Tenant Status (Active / Suspended / Canceled)
 */
export async function updateTenantStatus(
  organizationId: string,
  newStatus: OrganizationStatus,
  reason?: string
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('organizations')
    .update({
      status: newStatus,
      suspended_reason: reason || null,
    })
    .eq('id', organizationId);

  if (error) {
    console.error('Error updating tenant status:', error);
    return false;
  }

  await logAdminAction('tenant.status_change', 'organization', organizationId, {
    new_status: newStatus,
    reason: reason || 'Nenhum motivo informado',
  });

  return true;
}

/**
 * Update Tenant Plan Tier and Custom MRR
 */
export async function updateTenantPlan(
  organizationId: string,
  planTier: string,
  customMrr?: number
): Promise<boolean> {
  const supabase = createClient();

  const mrrValue = customMrr !== undefined ? customMrr : (PLAN_PRICES[planTier] || 97.00);

  const { error } = await supabase
    .from('organizations')
    .update({
      plan_tier: planTier,
      custom_mrr: mrrValue,
    })
    .eq('id', organizationId);

  if (error) {
    console.error('Error updating tenant plan:', error);
    return false;
  }

  await logAdminAction('tenant.plan_change', 'organization', organizationId, {
    plan_tier: planTier,
    custom_mrr: mrrValue,
  });

  return true;
}

/**
 * Fetch Recent Invoices across all tenants
 */
export async function fetchAdminInvoices(limit = 20): Promise<Invoice[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      id,
      organization_id,
      amount,
      status,
      gateway,
      gateway_invoice_id,
      invoice_url,
      due_date,
      paid_at,
      created_at,
      organizations (name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching admin invoices:', error);
    return [];
  }

  return (data || []).map((inv: any) => ({
    id: inv.id,
    organization_id: inv.organization_id,
    organization_name: inv.organizations?.name || 'Cliente Zapella',
    amount: Number(inv.amount),
    status: inv.status,
    gateway: inv.gateway,
    gateway_invoice_id: inv.gateway_invoice_id,
    invoice_url: inv.invoice_url,
    due_date: inv.due_date,
    paid_at: inv.paid_at,
    created_at: inv.created_at,
  }));
}

/**
 * Super Admin: Reset a subscriber's password via RPC
 */
export async function adminResetUserPassword(userId: string, newPassword: string): Promise<boolean> {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.rpc('admin_reset_user_password', {
      target_user_id: userId,
      new_password: newPassword,
    });

    if (error) {
      console.error('Error resetting password via RPC:', error);
      return false;
    }

    await logAdminAction('user.password_reset', 'user', userId, {
      reset_by_admin: true,
    });

    return !!data;
  } catch (err) {
    console.error('Error in adminResetUserPassword:', err);
    return false;
  }
}
