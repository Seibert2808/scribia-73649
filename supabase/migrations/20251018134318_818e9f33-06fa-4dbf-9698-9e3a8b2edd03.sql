-- Fix scribia_create_livebook to properly cast tipo_resumo ENUM
CREATE OR REPLACE FUNCTION public.scribia_create_livebook(
  p_palestra_id uuid,
  p_usuario_id uuid,
  p_tipo_resumo text,
  p_status text DEFAULT 'processando'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_livebook_id UUID;
BEGIN
  -- Validar que a palestra existe e pertence ao usuário
  IF NOT EXISTS (
    SELECT 1 FROM public.scribia_palestras 
    WHERE id = p_palestra_id AND usuario_id = p_usuario_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Palestra não encontrada ou não pertence ao usuário'
    );
  END IF;

  -- Inserir livebook com cast explícito do ENUM tipo_resumo
  INSERT INTO public.scribia_livebooks (
    palestra_id,
    usuario_id,
    tipo_resumo,
    status
  ) VALUES (
    p_palestra_id,
    p_usuario_id,
    p_tipo_resumo::tipo_resumo,  -- Cast explícito para o ENUM
    p_status::status_livebook     -- Cast explícito para o ENUM status
  )
  RETURNING id INTO v_livebook_id;

  RETURN json_build_object(
    'success', true,
    'livebook_id', v_livebook_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$;