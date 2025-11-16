-- Remover tabela de processamento de chunks (não mais necessária com Deepgram)
DROP TABLE IF EXISTS public.scribia_audio_processing CASCADE;

-- Remover função RPC associada
DROP FUNCTION IF EXISTS public.scribia_get_audio_processing_status(uuid) CASCADE;