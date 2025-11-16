-- Remover todas as versões da função scribia_create_palestra
DROP FUNCTION IF EXISTS public.scribia_create_palestra CASCADE;

-- Criar função RPC para criar palestras com SECURITY DEFINER
CREATE FUNCTION public.scribia_create_palestra(
  p_usuario_id UUID,
  p_evento_id UUID,
  p_titulo TEXT,
  p_palestrante TEXT DEFAULT NULL,
  p_tags_tema TEXT[] DEFAULT NULL,
  p_nivel_escolhido TEXT DEFAULT NULL,
  p_formato_escolhido TEXT DEFAULT NULL,
  p_origem_classificacao TEXT DEFAULT 'manual',
  p_confidence NUMERIC DEFAULT NULL,
  p_webhook_destino TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'aguardando',
  p_audio_urls TEXT[] DEFAULT NULL,
  p_slides_url TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_usuario_exists BOOLEAN;
  v_evento_exists BOOLEAN;
  v_palestra_id UUID;
BEGIN
  -- Validar se o usuário existe
  SELECT EXISTS(
    SELECT 1 FROM public.scribia_usuarios WHERE id = p_usuario_id
  ) INTO v_usuario_exists;

  IF NOT v_usuario_exists THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;

  -- Se evento_id foi fornecido, validar se pertence ao usuário
  IF p_evento_id IS NOT NULL THEN
    SELECT EXISTS(
      SELECT 1 FROM public.scribia_eventos 
      WHERE id = p_evento_id AND usuario_id = p_usuario_id
    ) INTO v_evento_exists;

    IF NOT v_evento_exists THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Evento não encontrado ou não pertence ao usuário'
      );
    END IF;
  END IF;

  -- Validar título
  IF p_titulo IS NULL OR TRIM(p_titulo) = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Título é obrigatório'
    );
  END IF;

  -- Inserir palestra
  INSERT INTO public.scribia_palestras (
    usuario_id,
    evento_id,
    titulo,
    palestrante,
    tags_tema,
    nivel_escolhido,
    formato_escolhido,
    origem_classificacao,
    confidence,
    webhook_destino,
    status,
    audio_urls,
    slides_url
  ) VALUES (
    p_usuario_id,
    p_evento_id,
    p_titulo,
    p_palestrante,
    p_tags_tema,
    p_nivel_escolhido,
    p_formato_escolhido,
    p_origem_classificacao,
    p_confidence,
    p_webhook_destino,
    p_status,
    p_audio_urls,
    p_slides_url
  )
  RETURNING id INTO v_palestra_id;

  RETURN json_build_object(
    'success', true,
    'palestra_id', v_palestra_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Conceder permissões
GRANT EXECUTE ON FUNCTION public.scribia_create_palestra TO authenticated, anon;

-- Comentário
COMMENT ON FUNCTION public.scribia_create_palestra IS 'Cria uma palestra. Usa SECURITY DEFINER para evitar problemas de RLS.';