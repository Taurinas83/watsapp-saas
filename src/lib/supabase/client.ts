import { createBrowserClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bzylhanxrluzagjsoatr.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  // Se executado no servidor com a chave de serviço configurada, utiliza acesso administrativo seguro
  if (typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createSupabaseClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
