-- Remover função antiga e criar nova com parâmetros corretos
DROP FUNCTION IF EXISTS public.scribia_get_livebooks(uuid, uuid);

-- Criar função RPC para buscar livebooks com SECURITY DEFINER
-- Essa função bypassa RLS e funciona com sistema de auth customizado
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
            'evento_id', p.evento_id
          )
        ) ORDER BY l.criado_em DESC
      ), '[]'::json)
    )
    FROM scribia_livebooks l
    INNER JOIN scribia_palestras p ON l.palestra_id = p.id
    WHERE l.usuario_id = p_usuario_id
      AND (p_evento_id IS NULL OR p.evento_id = p_evento_id)
  );
END;
$$;