// Edge Function: scribia-free-signup
// Public endpoint to insert free-trial leads into scribia_client_free and notify N8N
// Uses Service Role key internally for safe server-side insertion

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const n8nWebhookUrl = 'https://sabrinaseibert.app.n8n.cloud/webhook/scribia/free-client/new';

const payloadSchema = z.object({
  nome_completo: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  // Accepts already formatted "+55..." or raw digits like "219..."
  whatsapp: z.string().trim().min(10).max(20),
});

function toE164Brazil(number: string): string {
  // Keep digits only
  const digits = number.replace(/\D/g, '');
  // If already starts with country code 55
  if (digits.startsWith('55')) return `+${digits}`;
  // Otherwise prefix Brazil code
  return `+55${digits}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid payload', details: parsed.error.flatten() }), { status: 400, headers: corsHeaders });
    }

    const { nome_completo, email, whatsapp } = parsed.data;
    const whatsapp_e164 = toE164Brazil(whatsapp);

    const { data, error } = await supabase
      .from('scribia_client_free')
      .insert({
        name: nome_completo,
        email,
        whatsapp_e164,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return new Response(JSON.stringify({ error: 'RLS or insert error', details: error.message }), { status: 401, headers: corsHeaders });
    }

    // Fire-and-forget webhook notification
    const webhookBody = {
      id_client_free: data?.id_client_free ?? null,
      name: data?.name ?? nome_completo,
      email: data?.email ?? email,
      whatsapp_e164,
      created_at: data?.created_at ?? new Date().toISOString(),
      source: 'scribia-free-signup-edge',
    };

    // Use background task to avoid blocking response
    // @ts-ignore - EdgeRuntime is available in Deno Deploy
    EdgeRuntime.waitUntil(
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody),
      }).then((res) => {
        if (!res.ok) console.error('N8N webhook failed with status', res.status);
      }).catch((err) => console.error('N8N webhook error:', err))
    );

    return new Response(JSON.stringify({ success: true, data }), { status: 200, headers: corsHeaders });
  } catch (e) {
    console.error('Unhandled error:', e);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500, headers: corsHeaders });
  }
});
