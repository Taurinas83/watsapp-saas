import { NextRequest, NextResponse } from 'next/server';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmEzODEzZWYzLTM2YmQtNDg4YS1hZjEwLWJmODZiYzhkMzAxNDo6JGFhY2hfMDViNTE1MzAtZjA0MS00OTYwLWFjMjMtMTEwOGNmNjY5MzAy';
const ASAAS_API_URL = 'https://www.asaas.com/api/v3';

export async function POST(req: NextRequest) {
  try {
    const { planId, customerName, email, cpfCnpj, phone } = await req.json();

    const planPrices: Record<string, { value: number; name: string }> = {
      starter: { value: 149.00, name: 'Plano Starter - Atendente Virtual' },
      pro: { value: 299.00, name: 'Plano Pro Negócios - Atendente Virtual' },
      enterprise: { value: 599.00, name: 'Plano Enterprise - Atendente Virtual' }
    };

    const selectedPlan = planPrices[planId] || planPrices.pro;

    // 1. Criar ou buscar cliente no Asaas
    const customerRes = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY
      },
      body: JSON.stringify({
        name: customerName || 'Cliente SaaS',
        email: email || 'cliente@empresa.com',
        cpfCnpj: cpfCnpj || '00000000000',
        mobilePhone: phone || ''
      })
    });

    const customerData = await customerRes.json();
    const customerId = customerData.id;

    // 2. Criar cobrança / assinatura recorrente via PIX & Cartão
    const paymentRes = await fetch(`${ASAAS_API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: ASAAS_API_KEY
      },
      body: JSON.stringify({
        customer: customerId,
        billingType: 'UNDEFINED', // Permite PIX, Cartão e Boleto
        value: selectedPlan.value,
        nextDueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        cycle: 'MONTHLY',
        description: selectedPlan.name
      })
    });

    const paymentData = await paymentRes.json();

    return NextResponse.json({
      success: true,
      subscriptionId: paymentData.id,
      invoiceUrl: paymentData.invoiceUrl || `https://www.asaas.com/i/${paymentData.id}`
    });
  } catch (err: any) {
    console.error('Erro no Checkout Asaas:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
