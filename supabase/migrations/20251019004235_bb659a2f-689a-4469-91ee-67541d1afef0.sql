-- Corrigir ambiguidade de coluna 'id' na função scribia_get_livebook_by_palestra
CREATE OR REPLACE FUNCTION public.scribia_get_livebook_by_palestra(p_palestra_id uuid, p_usuario_id uuid)
 RETURNS TABLE(id uuid, status text, pdf_url text, html_url text, docx_url text, tipo_resumo text, erro_log text, titulo text, palestrante text, criado_em timestamp with time zone, atualizado_em timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Validar que a palestra pertence ao usuário (qualificar coluna com nome da tabela)
  IF NOT EXISTS (
    SELECT 1 FROM scribia_palestras 
    WHERE scribia_palestras.id = p_palestra_id AND scribia_palestras.usuario_id = p_usuario_id
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
$function$;