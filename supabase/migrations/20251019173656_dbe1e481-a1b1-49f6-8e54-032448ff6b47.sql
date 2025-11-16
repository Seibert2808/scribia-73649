-- Remover todas as versões conflitantes da função scribia_update_palestra
DROP FUNCTION IF EXISTS public.scribia_update_palestra(uuid, uuid, text, text, text[], text, text, text, text);
DROP FUNCTION IF EXISTS public.scribia_update_palestra(uuid, uuid, text, text, text[], text, text, text, numeric, text, text, text, text, text);
DROP FUNCTION IF EXISTS public.scribia_update_palestra(uuid, uuid, text, text, text[], text, text, text, numeric, text, text, text[], text, text);

-- Criar versão única e consolidada da função
CREATE OR REPLACE FUNCTION public.scribia_update_palestra(
  p_palestra_id UUID,
  p_usuario_id UUID,
  p_titulo TEXT DEFAULT NULL,
  p_palestrante TEXT DEFAULT NULL,
  p_tags_tema TEXT[] DEFAULT NULL,
  p_nivel_escolhido TEXT DEFAULT NULL,
  p_formato_escolhido TEXT DEFAULT NULL,
  p_origem_classificacao TEXT DEFAULT NULL,
  p_confidence NUMERIC DEFAULT NULL,
  p_webhook_destino TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_audio_urls TEXT[] DEFAULT NULL,
  p_slides_url TEXT DEFAULT NULL,
  p_transcricao_url TEXT DEFAULT NULL
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $$
BEGIN
  -- Verificar se a palestra pertence ao usuário
  IF NOT EXISTS (
    SELECT 1 FROM public.scribia_palestras 
    WHERE id = p_palestra_id AND usuario_id = p_usuario_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Palestra não encontrada ou não pertence ao usuário'
    );
  END IF;

  -- Atualizar campos não nulos
  UPDATE public.scribia_palestras
  SET
    titulo = COALESCE(p_titulo, titulo),
    palestrante = COALESCE(p_palestrante, palestrante),
    tags_tema = COALESCE(p_tags_tema, tags_tema),
    nivel_escolhido = CASE WHEN p_nivel_escolhido IS NULL THEN nivel_escolhido ELSE p_nivel_escolhido::nivel_conhecimento END,
    formato_escolhido = CASE WHEN p_formato_escolhido IS NULL THEN formato_escolhido ELSE p_formato_escolhido::formato_palestra END,
    origem_classificacao = CASE WHEN p_origem_classificacao IS NULL THEN origem_classificacao ELSE p_origem_classificacao::origem_classificacao END,
    confidence = COALESCE(p_confidence, confidence),
    webhook_destino = COALESCE(p_webhook_destino, webhook_destino),
    status = CASE WHEN p_status IS NULL THEN status ELSE p_status::status_palestra END,
    audio_urls = COALESCE(p_audio_urls, audio_urls),
    slides_url = COALESCE(p_slides_url, slides_url),
    transcricao_url = COALESCE(p_transcricao_url, transcricao_url),
    atualizado_em = NOW()
  WHERE id = p_palestra_id;

  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Garantir permissões
GRANT EXECUTE ON FUNCTION public.scribia_update_palestra TO authenticated, anon;