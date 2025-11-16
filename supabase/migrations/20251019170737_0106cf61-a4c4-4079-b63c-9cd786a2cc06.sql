-- Atualizar função scribia_get_livebooks para incluir dados completos do evento
CREATE OR REPLACE FUNCTION public.scribia_get_livebooks(
  p_usuario_id UUID,
  p_evento_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'success', true,
      'livebooks', COALESCE(json_agg(
        json_build_object(
          'id', l.id,
          'palestra_id', l.palestra_id,
          'usuario_id', l.usuario_id,
          'tipo_resumo', l.tipo_resumo,
          'status', l.status,
          'pdf_url', l.pdf_url,
          'docx_url', l.docx_url,
          'html_url', l.html_url,
          'tempo_processamento', l.tempo_processamento,
          'erro_log', l.erro_log,
          'criado_em', l.criado_em,
          'atualizado_em', l.atualizado_em,
          'palestra', json_build_object(
            'id', p.id,
            'titulo', p.titulo,
            'palestrante', p.palestrante,
            'nivel_escolhido', p.nivel_escolhido,
            'formato_escolhido', p.formato_escolhido,
            'evento_id', p.evento_id,
            'evento', CASE 
              WHEN e.id IS NOT NULL THEN
                json_build_object(
                  'id', e.id,
                  'nome_evento', e.nome_evento,
                  'data_inicio', e.data_inicio,
                  'data_fim', e.data_fim,
                  'cidade', e.cidade,
                  'estado', e.estado,
                  'pais', e.pais
                )
              ELSE NULL
            END
          )
        ) ORDER BY l.criado_em DESC
      ), '[]'::json)
    )
    FROM scribia_livebooks l
    INNER JOIN scribia_palestras p ON l.palestra_id = p.id
    LEFT JOIN scribia_eventos e ON p.evento_id = e.id
    WHERE l.usuario_id = p_usuario_id
      AND (p_evento_id IS NULL OR p.evento_id = p_evento_id)
  );
END;
$$;