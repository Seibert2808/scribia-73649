-- Função RPC para buscar palestra completa (bypassa RLS)
CREATE OR REPLACE FUNCTION public.scribia_get_palestra(
  p_palestra_id UUID,
  p_usuario_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_palestra RECORD;
BEGIN
  -- Buscar palestra validando que pertence ao usuário
  SELECT * INTO v_palestra
  FROM public.scribia_palestras
  WHERE id = p_palestra_id
    AND usuario_id = p_usuario_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Palestra não encontrada ou sem permissão'
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'data', row_to_json(v_palestra)
  );
END;
$$;