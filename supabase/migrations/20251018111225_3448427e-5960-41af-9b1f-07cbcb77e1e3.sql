-- Fix scribia_create_palestra to use correct ENUM type: formato_palestra instead of formato_livebook
CREATE OR REPLACE FUNCTION public.scribia_create_palestra(
  p_usuario_id uuid,
  p_evento_id uuid,
  p_titulo text,
  p_palestrante text DEFAULT NULL,
  p_tags_tema text[] DEFAULT NULL,
  p_nivel_escolhido text DEFAULT NULL,
  p_formato_escolhido text DEFAULT NULL,
  p_origem_classificacao text DEFAULT 'manual',
  p_confidence numeric DEFAULT NULL,
  p_webhook_destino text DEFAULT NULL,
  p_status text DEFAULT 'aguardando',
  p_audio_urls text[] DEFAULT NULL,
  p_slides_url text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  -- Inserir palestra com cast correto dos ENUMs (formato_palestra, não formato_livebook)
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
    CASE WHEN p_nivel_escolhido IS NULL THEN NULL ELSE p_nivel_escolhido::nivel_conhecimento END,
    CASE WHEN p_formato_escolhido IS NULL THEN NULL ELSE p_formato_escolhido::formato_palestra END,
    CASE WHEN p_origem_classificacao IS NULL THEN NULL ELSE p_origem_classificacao::origem_classificacao END,
    p_confidence,
    p_webhook_destino,
    CASE WHEN p_status IS NULL THEN NULL ELSE p_status::status_palestra END,
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
$function$;