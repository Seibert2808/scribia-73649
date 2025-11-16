-- Função RPC para buscar estatísticas do dashboard
CREATE OR REPLACE FUNCTION scribia_get_dashboard_stats(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
  v_total_eventos INTEGER;
  v_total_palestras INTEGER;
  v_total_livebooks INTEGER;
  v_livebooks_concluidos INTEGER;
  v_eventos_recentes JSON;
  v_livebooks_recentes JSON;
BEGIN
  -- Verificar se o usuário existe
  IF NOT EXISTS (SELECT 1 FROM scribia_usuarios WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Contar eventos
  SELECT COUNT(*) INTO v_total_eventos
  FROM scribia_eventos
  WHERE usuario_id = p_user_id;

  -- Contar palestras
  SELECT COUNT(*) INTO v_total_palestras
  FROM scribia_palestras
  WHERE usuario_id = p_user_id;

  -- Contar livebooks
  SELECT COUNT(*) INTO v_total_livebooks
  FROM scribia_livebooks
  WHERE usuario_id = p_user_id;

  -- Contar livebooks concluídos
  SELECT COUNT(*) INTO v_livebooks_concluidos
  FROM scribia_livebooks
  WHERE usuario_id = p_user_id AND status = 'concluido';

  -- Buscar eventos recentes
  SELECT COALESCE(json_agg(row_to_json(e.*)), '[]'::json) INTO v_eventos_recentes
  FROM (
    SELECT id, nome_evento, data_inicio
    FROM scribia_eventos
    WHERE usuario_id = p_user_id
    ORDER BY data_inicio DESC
    LIMIT 2
  ) e;

  -- Buscar livebooks recentes com join
  SELECT COALESCE(json_agg(row_to_json(l.*)), '[]'::json) INTO v_livebooks_recentes
  FROM (
    SELECT 
      lb.id, 
      lb.tipo_resumo, 
      lb.criado_em,
      json_build_object('titulo', p.titulo) as palestra
    FROM scribia_livebooks lb
    LEFT JOIN scribia_palestras p ON p.id = lb.palestra_id
    WHERE lb.usuario_id = p_user_id
    ORDER BY lb.criado_em DESC
    LIMIT 2
  ) l;

  -- Construir resultado
  v_result := json_build_object(
    'total_eventos', v_total_eventos,
    'total_palestras', v_total_palestras,
    'total_livebooks', v_total_livebooks,
    'livebooks_concluidos', v_livebooks_concluidos,
    'eventos_recentes', v_eventos_recentes,
    'livebooks_recentes', v_livebooks_recentes
  );

  RETURN v_result;
END;
$$;