-- Adicionar função para cancelar livebook
CREATE OR REPLACE FUNCTION public.scribia_cancel_livebook(
  p_livebook_id uuid,
  p_usuario_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Verificar se o livebook pertence ao usuário
  IF NOT EXISTS (
    SELECT 1 FROM public.scribia_livebooks 
    WHERE id = p_livebook_id AND usuario_id = p_usuario_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Livebook não encontrado ou não pertence ao usuário'
    );
  END IF;

  -- Atualizar status para erro (cancelado)
  UPDATE public.scribia_livebooks
  SET
    status = 'erro'::status_livebook,
    erro_log = 'Cancelado pelo usuário',
    atualizado_em = now()
  WHERE id = p_livebook_id AND status = 'processando'::status_livebook;

  -- Verificar se foi atualizado (só cancela se estiver processando)
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Livebook não está em processamento ou já foi concluído'
    );
  END IF;

  RETURN json_build_object('success', true);
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$function$;