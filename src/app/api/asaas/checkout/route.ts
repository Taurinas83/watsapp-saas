import { NextRequest, NextResponse } from 'next/server';

// Links oficiais gerados e ativos no Asaas para cada plano
const PLAN_LINKS: Record<string, { url: string; name: string; value: number }> = {
  starter: {
    url: 'https://www.asaas.com/c/i9vryhz03j002dnn',
    name: 'Plano Starter - Atendente Virtual',
    value: 149.00,
  },
  pro: {
    url: 'https://www.asaas.com/c/ukq2r3jczggrhibc',
    name: 'Plano Pro Negócios - Atendente Virtual',
    value: 299.00,
  },
  enterprise: {
    url: 'https://www.asaas.com/c/93308y4cw5ssn2vl',
    name: 'Plano Enterprise - Atendente Virtual',
    value: 599.00,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { planId = 'pro' } = await req.json().catch(() => ({ planId: 'pro' }));

    const plan = PLAN_LINKS[planId] || PLAN_LINKS.pro;

    return NextResponse.json({
      success: true,
      url: plan.url,
      planName: plan.name,
      value: plan.value,
    });
  } catch (err: any) {
    console.error('Erro no Checkout Asaas:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const planId = req.nextUrl.searchParams.get('plan') || req.nextUrl.searchParams.get('tier') || 'pro';
  const plan = PLAN_LINKS[planId] || PLAN_LINKS.pro;

  return NextResponse.redirect(plan.url);
}
