-- Criar função RPC para buscar livebooks de uma palestra com SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.scribia_get_livebooks_by_palestra(
  p_palestra_id UUID,
  p_usuario_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_livebooks JSON;
BEGIN
  -- Validar que a palestra pertence ao usuário
  IF NOT EXISTS (
    SELECT 1 FROM public.scribia_palestras
    WHERE id = p_palestra_id AND usuario_id = p_usuario_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Palestra não encontrada ou sem permissão'
    );
  END IF;

  -- Buscar livebooks com informações da palestra
  SELECT json_agg(
    json_build_object(
      'id', l.id,
      'palestra_id', l.palestra_id,
      'usuario_id', l.usuario_id,
      'tipo_resumo', l.tipo_resumo,
      'status', l.status,
      'pdf_url', l.pdf_url,
      'html_url', l.html_url,
      'docx_url', l.docx_url,
      'tempo_processamento', l.tempo_processamento,
      'erro_log', l.erro_log,
      'criado_em', l.criado_em,
      'atualizado_em', l.atualizado_em,
      'palestra', json_build_object(
        'titulo', p.titulo,
        'nivel_escolhido', p.nivel_escolhido,
        'formato_escolhido', p.formato_escolhido
      )
    ) ORDER BY l.criado_em DESC
  )
  INTO v_livebooks
  FROM public.scribia_livebooks l
  INNER JOIN public.scribia_palestras p ON l.palestra_id = p.id
  WHERE l.palestra_id = p_palestra_id
    AND l.usuario_id = p_usuario_id;

  RETURN json_build_object(
    'success', true,
    'data', COALESCE(v_livebooks, '[]'::json)
  );
END;
$$;

-- Conceder permissões
GRANT EXECUTE ON FUNCTION public.scribia_get_livebooks_by_palestra TO authenticated, anon, service_role;

-- Comentário
COMMENT ON FUNCTION public.scribia_get_livebooks_by_palestra IS 'Busca todos os livebooks de uma palestra específica. Usa SECURITY DEFINER para evitar problemas de RLS.';