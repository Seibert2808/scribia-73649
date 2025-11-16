-- ============================================
-- PERMITIR LIVEBOOKS GERAIS SEM EVENTOS
-- ============================================

-- Tornar evento_id opcional em scribia_palestras
ALTER TABLE public.scribia_palestras 
ALTER COLUMN evento_id DROP NOT NULL;

-- Adicionar comentário explicativo
COMMENT ON COLUMN public.scribia_palestras.evento_id IS 
'ID do evento associado. NULL indica uma palestra/livebook geral sem evento específico';

-- Remover TODAS as versões da função antiga
DO $$ 
DECLARE 
  func_signature text;
BEGIN
  FOR func_signature IN 
    SELECT pg_get_function_identity_arguments(p.oid) 
    FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE p.proname = 'scribia_create_palestra' 
    AND n.nspname = 'public'
  LOOP
    EXECUTE format('DROP FUNCTION IF EXISTS public.scribia_create_palestra(%s) CASCADE', func_signature);
  END LOOP;
END $$;

-- Criar nova função com evento_id opcional
CREATE FUNCTION public.scribia_create_palestra(
  p_usuario_id UUID,
  p_titulo TEXT,
  p_evento_id UUID DEFAULT NULL,
  p_palestrante TEXT DEFAULT NULL,
  p_tags_tema TEXT[] DEFAULT NULL,
  p_nivel_escolhido TEXT DEFAULT NULL,
  p_formato_escolhido TEXT DEFAULT NULL,
  p_origem_classificacao TEXT DEFAULT 'manual',
  p_confidence FLOAT DEFAULT NULL,
  p_webhook_destino TEXT DEFAULT NULL,
  p_audio_url TEXT DEFAULT NULL,
  p_slides_url TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_palestra_id UUID;
BEGIN
  -- Validar que o usuário existe
  IF NOT EXISTS (SELECT 1 FROM public.scribia_usuarios WHERE id = p_usuario_id) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;

  -- Validar evento apenas se foi fornecido
  IF p_evento_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.scribia_eventos 
      WHERE id = p_evento_id AND usuario_id = p_usuario_id
    ) THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Evento não encontrado ou não pertence ao usuário'
      );
    END IF;
  END IF;

  -- Inserir palestra (evento_id pode ser NULL para palestras gerais)
  INSERT INTO public.scribia_palestras (
    evento_id,
    usuario_id,
    titulo,
    palestrante,
    tags_tema,
    nivel_escolhido,
    formato_escolhido,
    origem_classificacao,
    confidence,
    webhook_destino,
    audio_url
  ) VALUES (
    p_evento_id,
    p_usuario_id,
    p_titulo,
    p_palestrante,
    p_tags_tema,
    p_nivel_escolhido,
    p_formato_escolhido,
    p_origem_classificacao,
    p_confidence,
    p_webhook_destino,
    p_audio_url
  )
  RETURNING id INTO v_palestra_id;

  -- Atualizar slides_url se fornecido
  IF p_slides_url IS NOT NULL THEN
    UPDATE public.scribia_palestras
    SET slides_url = p_slides_url
    WHERE id = v_palestra_id;
  END IF;

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

COMMENT ON FUNCTION public.scribia_create_palestra IS 
'Cria uma palestra. Se evento_id for NULL, cria uma palestra/livebook geral sem evento associado';