-- Criar função RPC para deletar livebooks com segurança
CREATE OR REPLACE FUNCTION public.scribia_delete_livebook(
  p_livebook_id UUID,
  p_usuario_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Verificar se o livebook pertence ao usuário
  SELECT COUNT(*)
  INTO v_count
  FROM public.scribia_livebooks
  WHERE id = p_livebook_id
    AND usuario_id = p_usuario_id;

  IF v_count = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Livebook não encontrado ou você não tem permissão para excluí-lo'
    );
  END IF;

  -- Deletar o livebook
  DELETE FROM public.scribia_livebooks
  WHERE id = p_livebook_id
    AND usuario_id = p_usuario_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Erro ao excluir livebook'
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Livebook excluído com sucesso'
  );
END;
$$;

-- Grant execute para authenticated users
GRANT EXECUTE ON FUNCTION public.scribia_delete_livebook(UUID, UUID) TO authenticated, anon, service_role;

-- Comentário
COMMENT ON FUNCTION public.scribia_delete_livebook IS 'Deleta um livebook de forma segura validando a propriedade do usuário';
