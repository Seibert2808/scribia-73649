-- Função RPC para deletar evento
CREATE OR REPLACE FUNCTION scribia_delete_evento(p_evento_id UUID, p_usuario_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Verificar se o evento pertence ao usuário
  SELECT COUNT(*) INTO v_count
  FROM scribia_eventos
  WHERE id = p_evento_id AND usuario_id = p_usuario_id;
  
  IF v_count = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Evento não encontrado ou você não tem permissão para excluí-lo'
    );
  END IF;
  
  -- Deletar o evento (CASCADE deletará palestras e livebooks relacionados)
  DELETE FROM scribia_eventos
  WHERE id = p_evento_id AND usuario_id = p_usuario_id;
  
  RETURN json_build_object('success', true, 'message', 'Evento excluído com sucesso');
END;
$$;

-- Função RPC para deletar palestra
CREATE OR REPLACE FUNCTION scribia_delete_palestra(p_palestra_id UUID, p_usuario_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Verificar se a palestra pertence ao usuário
  SELECT COUNT(*) INTO v_count
  FROM scribia_palestras
  WHERE id = p_palestra_id AND usuario_id = p_usuario_id;
  
  IF v_count = 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Palestra não encontrada ou você não tem permissão para excluí-la'
    );
  END IF;
  
  -- Deletar a palestra (CASCADE deletará livebooks relacionados se houver FK)
  DELETE FROM scribia_palestras
  WHERE id = p_palestra_id AND usuario_id = p_usuario_id;
  
  RETURN json_build_object('success', true, 'message', 'Palestra excluída com sucesso');
END;
$$;

-- Garantir permissões
GRANT EXECUTE ON FUNCTION scribia_delete_evento TO authenticated, anon;
GRANT EXECUTE ON FUNCTION scribia_delete_palestra TO authenticated, anon;