import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const palestraId = formData.get('palestraId') as string;
    const userId = formData.get('userId') as string;

    if (!file || !palestraId || !userId) {
      throw new Error('Missing required fields');
    }

    // Criar cliente Supabase com service_role para ignorar RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Gerar nome do arquivo - sanitizar para remover espaços e caracteres especiais
    const timestamp = Date.now();
    const sanitizedFileName = file.name
      .replace(/\s+/g, '_') // Substitui espaços por underscore
      .replace(/[^a-zA-Z0-9._-]/g, '') // Remove caracteres especiais
      .toLowerCase(); // Lowercase para padronização
    const fileName = `${userId}/${palestraId}/${timestamp}_${sanitizedFileName}`;

    console.log('📤 Uploading file:', fileName);

    // Fazer upload usando service_role (ignora RLS)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('audio-palestras')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('✅ Upload complete:', uploadData.path);

    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('audio-palestras')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Atualizar palestra com audio_url usando service_role (bypassa RLS)
    console.log('💾 Atualizando palestra com audio_url...');
    
    // Primeiro, buscar audio_urls existentes
    const { data: palestraData } = await supabaseAdmin
      .from('scribia_palestras')
      .select('audio_urls')
      .eq('id', palestraId)
      .single();

    const existingUrls = palestraData?.audio_urls || [];
    const updatedUrls = [...existingUrls, publicUrl];

    // Atualizar com novo array de URLs
    const { error: updateError } = await supabaseAdmin
      .from('scribia_palestras')
      .update({ 
        audio_urls: updatedUrls,
        status: 'processando'
      })
      .eq('id', palestraId);

    if (updateError) {
      console.error('⚠️ Erro ao atualizar palestra:', updateError);
      // Não falhar o upload por causa disso
    } else {
      console.log('✅ Palestra atualizada com audio_urls:', updatedUrls);
    }

    return new Response(
      JSON.stringify({
        success: true,
        path: uploadData.path,
        publicUrl: publicUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
