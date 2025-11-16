-- Criar função RPC para buscar livebook por palestra (bypass RLS)
CREATE OR REPLACE FUNCTION public.scribia_get_livebook_by_palestra(
  p_palestra_id UUID,
  p_usuario_id UUID
)
RETURNS TABLE(
  id UUID,
  status TEXT,
  pdf_url TEXT,
  html_url TEXT,
  docx_url TEXT,
  tipo_resumo TEXT,
  erro_log TEXT,
  titulo TEXT,
  palestrante TEXT,
  criado_em TIMESTAMPTZ,
  atualizado_em TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validar que a palestra pertence ao usuário
  IF NOT EXISTS (
    SELECT 1 FROM scribia_palestras 
    WHERE id = p_palestra_id AND usuario_id = p_usuario_id
  ) THEN
    RAISE EXCEPTION 'Palestra não encontrada ou sem permissão';
  END IF;

  -- Retornar livebook mais recente
  RETURN QUERY
  SELECT 
    l.id,
    l.status::TEXT,
    l.pdf_url,
    l.html_url,
    l.docx_url,
    l.tipo_resumo::TEXT,
    l.erro_log,
    p.titulo,
    p.palestrante,
    l.criado_em,
    l.atualizado_em
  FROM scribia_livebooks l
  INNER JOIN scribia_palestras p ON l.palestra_id = p.id
  WHERE l.palestra_id = p_palestra_id
    AND l.usuario_id = p_usuario_id
  ORDER BY l.criado_em DESC
  LIMIT 1;
END;
$$;