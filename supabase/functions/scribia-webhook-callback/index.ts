import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Webhook callback recebido:', payload);

    const { palestra_id, pdf_url, html_url, docx_url, summary_type, tempo_processamento, erro } = payload;

    if (!palestra_id) {
      throw new Error('palestra_id é obrigatório');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (erro) {
      // Update livebook with error
      const { error: updateError } = await supabase
        .from('scribia_livebooks')
        .update({
          status: 'erro',
          erro_log: erro,
          atualizado_em: new Date().toISOString(),
        })
        .eq('palestra_id', palestra_id);

      if (updateError) {
        console.error('Erro ao atualizar livebook com erro:', updateError);
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Erro registrado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update livebook with generated files
    const { error: updateError } = await supabase
      .from('scribia_livebooks')
      .update({
        pdf_url: pdf_url || null,
        html_url: html_url || null,
        docx_url: docx_url || null,
        status: 'concluido',
        tempo_processamento: tempo_processamento || null,
        atualizado_em: new Date().toISOString(),
      })
      .eq('palestra_id', palestra_id);

    if (updateError) {
      throw updateError;
    }

    // Also update palestra status
    await supabase
      .from('scribia_palestras')
      .update({ status: 'concluido' })
      .eq('id', palestra_id);

    console.log(`Livebook ${palestra_id} atualizado com sucesso`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Livebook atualizado com sucesso',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erro no webhook callback:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
