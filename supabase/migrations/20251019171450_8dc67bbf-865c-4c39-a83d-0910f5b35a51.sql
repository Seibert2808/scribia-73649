-- Criar/atualizar função RPC para editar palestra a partir de livebook
CREATE OR REPLACE FUNCTION public.scribia_update_palestra_from_livebook(
  p_palestra_id UUID,
  p_usuario_id UUID,
  p_titulo TEXT DEFAULT NULL,
  p_palestrante TEXT DEFAULT NULL,
  p_evento_id UUID DEFAULT NULL,
  p_remove_evento BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificar se a palestra pertence ao usuário
  IF NOT EXISTS (
    SELECT 1 FROM public.scribia_palestras 
    WHERE id = p_palestra_id AND usuario_id = p_usuario_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Palestra não encontrada ou sem permissão'
    );
  END IF;

  -- Se evento_id foi fornecido, verificar se pertence ao usuário
  IF p_evento_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.scribia_eventos
      WHERE id = p_evento_id AND usuario_id = p_usuario_id
    ) THEN
      RETURN json_build_object(
        'success', false,
        'error', 'Evento não encontrado ou sem permissão'
      );
    END IF;
  END IF;

  -- Atualizar palestra
  UPDATE public.scribia_palestras
  SET
    titulo = COALESCE(p_titulo, titulo),
    palestrante = COALESCE(p_palestrante, palestrante),
    evento_id = CASE 
      WHEN p_remove_evento THEN NULL
      ELSE COALESCE(p_evento_id, evento_id)
    END,
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