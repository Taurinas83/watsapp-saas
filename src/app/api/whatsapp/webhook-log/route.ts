import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook Debug Log
 * Stores the last 50 webhook payloads received for debugging purposes.
 * GET /api/whatsapp/webhook-log — returns recent webhook calls
 * DELETE /api/whatsapp/webhook-log — clears the log
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory log (resets on cold start, but works for debugging on Vercel)
// We'll use Supabase for persistent logging
import { createClient } from '@/lib/supabase/client';

export async function GET() {
  try {
    const supabase = createClient();
    
    // Get the last 50 webhook events from messages table
    const { data: recentMessages, error } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_type, sender_name, content, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    // Also get recent conversations
    const { data: recentConvs } = await supabase
      .from('conversations')
      .select('id, customer_phone, customer_name, status, last_message, last_message_at, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      recentMessages: recentMessages || [],
      recentConversations: recentConvs || [],
      messagesError: error?.message || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
