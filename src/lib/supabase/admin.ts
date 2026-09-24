import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com permissões de administrador (Service Role).
 * Este cliente NUNCA deve ser exposto ao navegador do usuário.
 * Usado exclusivamente em rotas de backend (API Routes, Webhooks e Cron jobs)
 * para realizar operações seguras com bypass controlado de RLS.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bzylhanxrluzagjsoatr.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_lZswFV_8sPJ8WCYvaFgGWg_ywWLFDXQ';

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
