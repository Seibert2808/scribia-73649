import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  try {
    const { audioUrl, palestraId, async: isAsync } = await req.json();

    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: 'audioUrl é obrigatório' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY não configurada' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log('🎧 Processando áudio:', audioUrl);
    console.log('📝 Palestra ID:', palestraId);
    console.log('🔄 Modo assíncrono:', isAsync);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Se modo assíncrono, retornar resposta imediata e processar em background
    if (isAsync) {
      // Processar em background
      const processTranscription = async () => {
        console.log('🔄 [ASYNC] Iniciando processamento em background...');
        try {
          // 1. Baixar áudio do Storage
          const urlParts = audioUrl.split('/storage/v1/object/public/audio-palestras/');
          if (!urlParts[1]) {
            throw new Error('URL de áudio inválida');
          }
          
          const filePath = decodeURIComponent(urlParts[1]);
          console.log('📂 [ASYNC] File path (decoded):', filePath);

          const { data: fileData, error: downloadError } = await supabase
            .storage
            .from('audio-palestras')
            .download(filePath);

          if (downloadError) {
            console.error('❌ [ASYNC] Erro no download do arquivo:', downloadError);
            throw new Error(`Erro ao baixar áudio: ${downloadError.message}`);
          }

          if (!fileData || fileData.size === 0) {
            console.error('❌ [ASYNC] Arquivo vazio ou inválido');
            throw new Error('Arquivo de áudio vazio ou inválido');
          }

          console.log('📦 [ASYNC] Tamanho do arquivo:', fileData.size, 'bytes');

          // 2. Preparar FormData para Whisper
          const formData = new FormData();
          formData.append('file', fileData, 'audio.mp3');
          formData.append('model', 'whisper-1');
          formData.append('language', 'pt');
          formData.append('response_format', 'text');

          console.log('🤖 [ASYNC] Enviando para OpenAI Whisper...');

          // 3. Chamar OpenAI Whisper API
          const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: formData,
          });

          if (!whisperResponse.ok) {
            const errorText = await whisperResponse.text();
            throw new Error(`Erro OpenAI: ${whisperResponse.status} - ${errorText}`);
          }

          const transcricao = await whisperResponse.text();
          console.log('✅ [ASYNC] Transcrição concluída:', transcricao.substring(0, 100) + '...');
          console.log('📊 [ASYNC] Total de caracteres:', transcricao.length);

          // 4. Atualizar palestra no banco com status concluído
          if (palestraId) {
            const { error: updateError } = await supabase
              .from('scribia_palestras')
              .update({ 
                transcricao,
                status: 'concluido'
              })
              .eq('id', palestraId);

            if (updateError) {
              console.error('⚠️ [ASYNC] Erro ao salvar transcrição:', updateError);
            } else {
              console.log('💾 [ASYNC] Transcrição salva no banco com status concluído');
            }
          }
        } catch (error: any) {
          console.error('❌ [ASYNC] Erro no processamento:', error);
          
          // Atualizar status para erro
          if (palestraId) {
            await supabase
              .from('scribia_palestras')
              .update({ status: 'erro' })
              .eq('id', palestraId);
          }
        }
      };

      // Usar EdgeRuntime.waitUntil para garantir que a tarefa continue após a resposta
      // @ts-ignore - EdgeRuntime está disponível no Deno Deploy
      if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(processTranscription());
      } else {
        // Fallback para desenvolvimento local
        processTranscription();
      }

      // Retornar resposta imediata
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Transcrição iniciada em background',
          palestraId,
          status: 'processando'
        }),
        {
          status: 202, // Accepted
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Modo síncrono (original)
    // 1. Baixar áudio do Storage
    
    // Extrair path do URL
    const urlParts = audioUrl.split('/storage/v1/object/public/audio-palestras/');
    if (!urlParts[1]) {
      return new Response(
        JSON.stringify({ error: 'URL de áudio inválida' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const filePath = decodeURIComponent(urlParts[1]);
    console.log('📂 File path (decoded):', filePath);

    // Download usando Supabase client
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('audio-palestras')
      .download(filePath);

    if (downloadError) {
      console.error('❌ Erro ao baixar:', downloadError);
      return new Response(
        JSON.stringify({ error: `Erro ao baixar áudio: ${downloadError.message}` }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    if (!fileData || fileData.size === 0) {
      console.error('❌ Arquivo vazio ou inválido');
      return new Response(
        JSON.stringify({ error: 'Arquivo de áudio vazio ou inválido' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log('📦 Tamanho do arquivo:', fileData.size, 'bytes');

    // 2. Preparar FormData para Whisper
    const formData = new FormData();
    formData.append('file', fileData, 'audio.mp3');
    formData.append('model', 'whisper-1');
    formData.append('language', 'pt');
    formData.append('response_format', 'text');

    console.log('🤖 Enviando para OpenAI Whisper...');

    // 3. Chamar OpenAI Whisper API com timeout maior
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 280000); // 280 segundos (antes do timeout da função)

    let whisperResponse;
    try {
      whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: formData,
        signal: controller.signal
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Timeout ao processar áudio. O arquivo pode ser muito grande.' }),
          {
            status: 504,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('❌ Erro OpenAI:', whisperResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Erro na transcrição OpenAI: ${whisperResponse.status}` }),
        {
          status: whisperResponse.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const transcricao = await whisperResponse.text();
    console.log('✅ Transcrição concluída:', transcricao.substring(0, 100) + '...');
    console.log('📊 Total de caracteres:', transcricao.length);

    // 4. Atualizar palestra no banco (se palestraId foi fornecido)
    if (palestraId) {
      const { error: updateError } = await supabase
        .from('scribia_palestras')
        .update({ 
          transcricao,
          status: 'processando'
        })
        .eq('id', palestraId);

      if (updateError) {
        console.error('⚠️ Erro ao salvar transcrição:', updateError);
      } else {
        console.log('💾 Transcrição salva no banco');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        transcricao,
        palestraId,
        caracteres: transcricao.length
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error: any) {
    console.error('❌ Erro na função:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro desconhecido',
        details: error.toString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
