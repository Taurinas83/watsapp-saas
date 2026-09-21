import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // 1. Validar Token de Segurança do Webhook se configurado
    const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
    const receivedToken = req.headers.get('asaas-access-token');

    if (webhookToken && receivedToken && receivedToken !== webhookToken) {
      console.warn('Aviso: Token do Webhook Asaas inválido.');
      return NextResponse.json({ error: 'Unauthorized webhook token' }, { status: 401 });
    }

    const payload = await req.json();
    const event = payload?.event;
    const payment = payload?.payment;

    console.log(`[Asaas Webhook] Evento recebido: ${event} | Pagamento ID: ${payment?.id}`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Configurações do Supabase ausentes para o Webhook Asaas.');
      return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const customerEmail = payment?.customerEmail || payment?.email;

    // Buscar perfil pelo e-mail do cliente
    let organizationId: string | null = null;
    if (customerEmail) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('email', customerEmail)
        .single();

      if (profile?.organization_id) {
        organizationId = profile.organization_id;
      }
    }

    // Se não encontrou por e-mail, tentar encontrar por stripe_customer_id ou busca em organizations
    if (!organizationId && payment?.customer) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('stripe_customer_id', payment.customer)
        .single();

      if (org?.id) {
        organizationId = org.id;
      }
    }

    const paymentValue = Number(payment?.value || payment?.netValue || 0);
    const invoiceUrl = payment?.invoiceUrl || payment?.bankSlipUrl || payment?.transactionReceiptUrl;
    const dueDate = payment?.dueDate || new Date().toISOString().split('T')[0];

    // ==========================================
    // CASO 1: PAGAMENTO RECEBIDO / CONFIRMADO
    // ==========================================
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      let planTier = 'starter';
      let aiPref = 'gemini';

      const desc = (payment?.description || '').toLowerCase();
      if (paymentValue >= 500 || desc.includes('enterprise')) {
        planTier = 'enterprise';
        aiPref = 'claude';
      } else if (paymentValue >= 250 || desc.includes('pro')) {
        planTier = 'pro';
        aiPref = 'claude';
      } else {
        planTier = 'starter';
        aiPref = 'gemini';
      }

      if (organizationId) {
        // Atualizar status e plano da organização
        await supabase
          .from('organizations')
          .update({
            status: 'active',
            stripe_subscription_status: 'active',
            plan_tier: planTier,
            ai_model_preference: aiPref,
            custom_mrr: paymentValue > 0 ? paymentValue : undefined,
            suspended_reason: null,
          })
          .eq('id', organizationId);

        // Registrar na tabela de faturas (invoices)
        await supabase
          .from('invoices')
          .insert({
            organization_id: organizationId,
            amount: paymentValue,
            status: 'paid',
            gateway: 'asaas',
            gateway_invoice_id: payment?.id,
            invoice_url: invoiceUrl,
            due_date: dueDate,
            paid_at: new Date().toISOString(),
          });

        // Registrar na trilha de auditoria administrativa
        await supabase
          .from('admin_audit_logs')
          .insert({
            action: 'payment.received',
            target_type: 'organization',
            target_id: organizationId,
            details: {
              gateway: 'asaas',
              event,
              payment_id: payment?.id,
              amount: paymentValue,
              plan_tier: planTier,
              customer_email: customerEmail,
            },
          });

        console.log(`Organização ${organizationId} ativada com sucesso com plano ${planTier} via Asaas.`);
      }
    }

    // ==========================================
    // CASO 2: PAGAMENTO VENCIDO (INADIMPLÊNCIA)
    // ==========================================
    else if (event === 'PAYMENT_OVERDUE') {
      if (organizationId) {
        await supabase
          .from('organizations')
          .update({
            status: 'suspended',
            suspended_reason: `Inadimplência Asaas: fatura de R$ ${paymentValue.toFixed(2)} vencida em ${dueDate}`,
          })
          .eq('id', organizationId);

        await supabase
          .from('invoices')
          .insert({
            organization_id: organizationId,
            amount: paymentValue,
            status: 'overdue',
            gateway: 'asaas',
            gateway_invoice_id: payment?.id,
            invoice_url: invoiceUrl,
            due_date: dueDate,
          });

        await supabase
          .from('admin_audit_logs')
          .insert({
            action: 'payment.overdue',
            target_type: 'organization',
            target_id: organizationId,
            details: {
              gateway: 'asaas',
              payment_id: payment?.id,
              amount: paymentValue,
              due_date: dueDate,
            },
          });

        console.log(`Organização ${organizationId} marcada como suspensa por inadimplência via Asaas.`);
      }
    }

    // ==========================================
    // CASO 3: PAGAMENTO ESTORNADO / REEMBOLSADO
    // ==========================================
    else if (event === 'PAYMENT_REFUNDED') {
      if (organizationId) {
        await supabase
          .from('organizations')
          .update({
            status: 'canceled',
            suspended_reason: 'Pagamento estornado no Asaas',
          })
          .eq('id', organizationId);

        await supabase
          .from('admin_audit_logs')
          .insert({
            action: 'payment.refunded',
            target_type: 'organization',
            target_id: organizationId,
            details: {
              gateway: 'asaas',
              payment_id: payment?.id,
              amount: paymentValue,
            },
          });
      }
    }

    return NextResponse.json({ status: 'success', processed: true });
  } catch (err: any) {
    console.error('Erro no processamento do Webhook Asaas:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
