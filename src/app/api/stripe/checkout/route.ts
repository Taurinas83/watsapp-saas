import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { planId, email } = await req.json();

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey || stripeSecretKey === 'sk_test_...') {
      // Fallback para demonstração sem travar a navegação
      return NextResponse.json({
        url: '/dashboard/attendant?subscribed=true',
        mock: true
      });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-09-30.acacia' as any });

    const priceMap: Record<string, string> = {
      starter: 'price_starter_monthly',
      pro: 'price_pro_monthly',
      enterprise: 'price_enterprise_monthly'
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceMap[planId] || priceMap.pro,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      success_url: `${req.nextUrl.origin}/dashboard/attendant?success=true`,
      cancel_url: `${req.nextUrl.origin}/#planos`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erro no Stripe Checkout:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
