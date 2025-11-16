-- Tabela para rastrear processamento de áudios em chunks
CREATE TABLE IF NOT EXISTS public.scribia_audio_processing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palestra_id UUID NOT NULL REFERENCES public.scribia_palestras(id) ON DELETE CASCADE,
  audio_url TEXT NOT NULL,
  total_chunks INT NOT NULL DEFAULT 1,
  chunks_processed INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,
  retry_count INT NOT NULL DEFAULT 0,
  max_retries INT NOT NULL DEFAULT 3,
  transcription_parts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_audio_processing_palestra ON public.scribia_audio_processing(palestra_id);
CREATE INDEX IF NOT EXISTS idx_audio_processing_status ON public.scribia_audio_processing(status);

-- RLS desabilitado (seguindo padrão do projeto)
ALTER TABLE public.scribia_audio_processing DISABLE ROW LEVEL SECURITY;

-- Função RPC para obter status de processamento com progresso
CREATE OR REPLACE FUNCTION public.scribia_get_audio_processing_status(
  p_palestra_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'success', true,
    'processing', row_to_json(ap.*)
  )
  INTO v_result
  FROM public.scribia_audio_processing ap
  WHERE ap.palestra_id = p_palestra_id
  ORDER BY ap.created_at DESC
  LIMIT 1;

  RETURN COALESCE(v_result, json_build_object('success', false, 'error', 'Processamento não encontrado'));
END;
$$;

GRANT EXECUTE ON FUNCTION public.scribia_get_audio_processing_status TO authenticated, anon;