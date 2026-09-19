import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const event = payload?.event;
    const payment = payload?.payment;

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const customerEmail = payment?.customerEmail;
      console.log(`Pagamento do Asaas confirmado com sucesso para o e-mail: ${customerEmail}`);

      // Atualizar status da empresa no Supabase se houver e-mail
      if (customerEmail) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { data: profile } = await supabase
            .from('profiles')
            .select('organization_id')
            .eq('email', customerEmail)
            .single();

          if (profile?.organization_id) {
            await supabase
              .from('organizations')
              .update({ stripe_subscription_status: 'active' })
              .eq('id', profile.organization_id);
          }
        }
      }
    }

    return NextResponse.json({ status: 'received' });
  } catch (err: any) {
    console.error('Erro no Webhook do Asaas:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
