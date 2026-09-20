import { createClient } from '@/lib/supabase/client';
import { Organization, Profile, AdminAuditLog, Invoice, OrganizationStatus } from '@/types';

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
}

/**
 * Fetch Overview Metrics for God Mode Dashboard
 */
export async function fetchAdminOverviewMetrics(): Promise<OverviewMetrics> {
  const supabase = createClient();

  // 1. Fetch all organizations
  const { data: orgs, error: orgsError } = await supabase
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
  };
}

export interface TenantListItem extends Organization {
  ownerName: string;
  ownerEmail: string;
  attendantConnected: boolean;
  messagesCount: number;
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
      stripe_customer_id,
      stripe_subscription_status,
      created_at,
      plan_tier,
      ai_model_preference,
      status,
      suspended_reason,
      custom_mrr,
      billing_cycle,
      profiles (
        id,
        full_name,
        email,
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

  const tenants: TenantListItem[] = (rawOrgs || []).map((item: any) => {
    const primaryProfile = Array.isArray(item.profiles) && item.profiles.length > 0
      ? item.profiles[0]
      : { full_name: 'Não informado', email: 'sem-email@zapella.com' };

    const primaryAttendant = Array.isArray(item.attendants) && item.attendants.length > 0
      ? item.attendants[0]
      : null;

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
      ownerName: primaryProfile.full_name || 'Sem nome',
      ownerEmail: primaryProfile.email || '',
      attendantConnected: primaryAttendant?.whatsapp_status === 'connected',
      messagesCount: 0, // Enriched if needed
    };
  });

  if (query && query.trim() !== '') {
    const q = query.toLowerCase().trim();
    return tenants.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.ownerName.toLowerCase().includes(q) ||
      t.ownerEmail.toLowerCase().includes(q)
    );
  }

  return tenants;
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
