import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { getCurrentUserOrganizationId } from '@/lib/supabase/actions';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const orgId = await getCurrentUserOrganizationId();

    const { data: messages, error } = await supabase
      .from('scheduled_messages')
      .select('*')
      .eq('organization_id', orgId)
      .order('scheduled_for', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const orgId = await getCurrentUserOrganizationId();
    const body = await req.json();

    const { target_jid, target_name, message_content, scheduled_for, media_url } = body;

    if (!target_jid || !message_content || !scheduled_for) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: target_jid, message_content, scheduled_for' },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduled_for);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Data e horário de agendamento inválidos' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('scheduled_messages')
      .insert({
        organization_id: orgId,
        target_jid,
        target_name: target_name || 'Grupo WhatsApp',
        message_content: message_content.trim(),
        media_url: media_url || null,
        scheduled_for: scheduledDate.toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const orgId = await getCurrentUserOrganizationId();
    const id = req.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da mensagem é obrigatório' }, { status: 400 });
    }

    const { error } = await supabase
      .from('scheduled_messages')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('organization_id', orgId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
