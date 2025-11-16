-- Create RPC function to get palestra status (bypasses RLS)
CREATE OR REPLACE FUNCTION public.scribia_get_palestra_status(
  p_palestra_id UUID,
  p_usuario_id UUID
)
RETURNS TABLE (
  id UUID,
  status TEXT,
  transcricao TEXT,
  audio_urls TEXT[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.status::TEXT,
    sp.transcricao,
    sp.audio_urls
  FROM public.scribia_palestras sp
  WHERE sp.id = p_palestra_id
    AND sp.usuario_id = p_usuario_id;
END;
$$;