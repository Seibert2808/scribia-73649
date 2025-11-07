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
    const { palestra_id, audio_url } = await req.json();

    if (!palestra_id || !audio_url) {
      throw new Error('palestra_id e audio_url são obrigatórios');
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY não configurada');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update status to transcrevendo
    await supabase
      .from('scribia_palestras')
      .update({ status: 'transcrevendo' })
      .eq('id', palestra_id);

    console.log(`[${palestra_id}] Iniciando transcrição do áudio: ${audio_url}`);

    // Download audio file
    const audioResponse = await fetch(audio_url);
    if (!audioResponse.ok) {
      throw new Error(`Falha ao baixar áudio: ${audioResponse.statusText}`);
    }

    const audioBlob = await audioResponse.blob();
    
    // Prepare form data for Whisper API
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('response_format', 'json');

    // Call Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const error = await whisperResponse.text();
      throw new Error(`Erro na API do Whisper: ${error}`);
    }

    const transcriptionData = await whisperResponse.json();
    const transcriptionText = transcriptionData.text;

    console.log(`[${palestra_id}] Transcrição concluída. Caracteres: ${transcriptionText.length}`);

    // Save transcription to storage
    const { data: authData } = await supabase.auth.admin.getUserById(
      (await supabase.from('scribia_palestras').select('usuario_id').eq('id', palestra_id).single()).data.usuario_id
    );

    const transcriptionFileName = `${authData.user.id}/transcricoes/${palestra_id}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scribia-audio')
      .upload(transcriptionFileName, transcriptionText, {
        contentType: 'text/plain',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('scribia-audio')
      .getPublicUrl(transcriptionFileName);

    // Update palestra with transcription URL
    await supabase
      .from('scribia_palestras')
      .update({
        transcricao_url: publicUrl,
        status: 'processando',
      })
      .eq('id', palestra_id);

    console.log(`[${palestra_id}] Transcrição salva em: ${publicUrl}`);

    // Get palestra details to trigger livebook generation
    const { data: palestraData } = await supabase
      .from('scribia_palestras')
      .select('*, scribia_usuarios!inner(*)')
      .eq('id', palestra_id)
      .single();

    if (palestraData && palestraData.webhook_destino) {
      console.log(`[${palestra_id}] Enviando para webhook: ${palestraData.webhook_destino}`);

      // Trigger webhook for livebook generation
      const webhookPayload = {
        user: {
          id: palestraData.usuario_id,
          email: palestraData.scribia_usuarios.email,
        },
        palestra: {
          id: palestraData.id,
          titulo: palestraData.titulo,
          nivel: palestraData.nivel_escolhido,
          formato: palestraData.formato_escolhido,
          transcricao_url: publicUrl,
          slides_url: palestraData.slides_url,
        },
      };

      // Call webhook asynchronously (don't wait for response)
      fetch(palestraData.webhook_destino, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload),
      }).catch((err) => {
        console.error(`[${palestra_id}] Erro ao chamar webhook:`, err);
      });

      // Create livebook record
      const tipo_resumo = `${palestraData.nivel_escolhido}_${palestraData.formato_escolhido}`;
      await supabase.from('scribia_livebooks').insert({
        palestra_id: palestra_id,
        usuario_id: palestraData.usuario_id,
        tipo_resumo: tipo_resumo,
        status: 'processando',
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        transcription_url: publicUrl,
        palestra_id: palestra_id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Erro na transcrição:', error);

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
