-- 1. Remover políticas UPDATE conflitantes na tabela scribia_usuarios
DROP POLICY IF EXISTS "Users can update own profile" ON public.scribia_usuarios;
DROP POLICY IF EXISTS "scribia_users_can_update_own_profile" ON public.scribia_usuarios;
DROP POLICY IF EXISTS "users_update_own" ON public.scribia_usuarios;

-- Garantir que a política permissiva existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'scribia_usuarios' 
    AND policyname = 'Allow custom auth functions'
  ) THEN
    CREATE POLICY "Allow custom auth functions" 
      ON public.scribia_usuarios 
      FOR ALL 
      USING (true);
  END IF;
END $$;

-- 2. Garantir permissões de execução
GRANT EXECUTE ON FUNCTION public.scribia_verify_email(text) TO anon;
GRANT EXECUTE ON FUNCTION public.scribia_verify_email(text) TO authenticated;

-- 3. Atualizar função com logging para debug
CREATE OR REPLACE FUNCTION public.scribia_verify_email(p_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_user_id uuid;
  v_rows_updated integer;
BEGIN
  RAISE LOG 'scribia_verify_email: Iniciando verificação com token: %', LEFT(p_token, 20);
  
  -- Buscar usuário pelo token
  SELECT id INTO v_user_id
  FROM public.scribia_usuarios
  WHERE token_verificacao = p_token AND NOT email_verificado;

  IF NOT FOUND THEN
    RAISE LOG 'scribia_verify_email: Token não encontrado ou email já verificado';
    RETURN json_build_object(
      'success', false,
      'error', 'Token inválido ou email já verificado'
    );
  END IF;

  RAISE LOG 'scribia_verify_email: Usuário encontrado: %, atualizando...', v_user_id;

  -- Verificar email
  UPDATE public.scribia_usuarios
  SET email_verificado = true, token_verificacao = NULL
  WHERE id = v_user_id;
  
  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;
  RAISE LOG 'scribia_verify_email: Rows updated: %', v_rows_updated;

  IF v_rows_updated = 0 THEN
    RAISE LOG 'scribia_verify_email: ERRO - Nenhuma linha atualizada!';
    RETURN json_build_object(
      'success', false,
      'error', 'Erro ao atualizar registro'
    );
  END IF;

  RAISE LOG 'scribia_verify_email: Verificação concluída com sucesso para user: %', v_user_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Email verificado com sucesso'
  );
END;
$function$;

-- 4. Limpar tokens de usuários já verificados
UPDATE public.scribia_usuarios
SET token_verificacao = NULL
WHERE email_verificado = true AND token_verificacao IS NOT NULL;