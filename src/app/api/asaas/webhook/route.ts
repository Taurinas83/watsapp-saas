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
            let planTier = 'starter';
            let aiPref = 'gemini';

            const val = Number(payment?.value || 0);
            const desc = (payment?.description || '').toLowerCase();

            if (val >= 500 || desc.includes('enterprise')) {
              planTier = 'enterprise';
              aiPref = 'claude';
            } else if (val >= 250 || desc.includes('pro')) {
              planTier = 'pro';
              aiPref = 'claude';
            } else {
              planTier = 'starter';
              aiPref = 'gemini';
            }

            await supabase
              .from('organizations')
              .update({
                stripe_subscription_status: 'active',
                plan_tier: planTier,
                ai_model_preference: aiPref,
              })
              .eq('id', profile.organization_id);

            console.log(`Organização ${profile.organization_id} atualizada para plano ${planTier} (${aiPref}) via Asaas.`);
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
