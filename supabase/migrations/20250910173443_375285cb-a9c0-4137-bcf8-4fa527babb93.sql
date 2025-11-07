-- CORREÇÃO DE SEGURANÇA: Restringir acesso às funções SECURITY DEFINER
-- Problema: Funções SECURITY DEFINER com acesso para usuários anônimos

-- 1. Revogar permissões desnecessárias das funções SECURITY DEFINER
-- Remover acesso público/anônimo que representa risco de segurança

-- Função get_current_user_email: remover acesso anônimo
REVOKE EXECUTE ON FUNCTION public.get_current_user_email() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_current_user_email() FROM public;

-- Função get_current_user_role: remover acesso anônimo  
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_current_user_role() FROM public;

-- Função handle_new_user: remover acesso anônimo (triggers não precisam de acesso público)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public;

-- 2. Garantir que apenas roles autenticados possam usar essas funções
-- (Mantém acesso para authenticated e service_role que são necessários)

GRANT EXECUTE ON FUNCTION public.get_current_user_email() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;
-- handle_new_user é um trigger, não precisa de GRANT explícito

-- 3. Para o ScribIA, como não usa autenticação, vamos verificar se essas funções são necessárias
-- Comentar sobre o uso para documentação futura

COMMENT ON FUNCTION public.get_current_user_email() IS 'FC Mother: Função para obter email do usuário autenticado. SECURITY DEFINER restrito a usuários autenticados apenas.';
COMMENT ON FUNCTION public.get_current_user_role() IS 'FC Mother: Função para obter role do usuário autenticado. SECURITY DEFINER restrito a usuários autenticados apenas.';
COMMENT ON FUNCTION public.handle_new_user() IS 'FC Mother: Trigger para processar novos usuários. SECURITY DEFINER para operações administrativas.';

-- 4. Adicionar validação extra nas funções para melhor segurança
-- Atualizar get_current_user_email para ser mais restritiva
CREATE OR REPLACE FUNCTION public.get_current_user_email()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  jwt_email TEXT;
BEGIN
  -- Verificar se existe um usuário autenticado
  IF auth.uid() IS NULL THEN
    RETURN NULL; -- Mais seguro que retornar 'simplified_auth_system'
  END IF;
  
  -- Try to get email from JWT claims
  BEGIN
    jwt_email := current_setting('request.jwt.claims', true)::json->>'email';
  EXCEPTION
    WHEN OTHERS THEN
      jwt_email := NULL;
  END;
  
  RETURN jwt_email;
END;
$function$;

-- 5. Atualizar get_current_user_role para ser mais restritiva
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_email TEXT;
  user_funcao TEXT;
BEGIN
  -- Verificar se existe um usuário autenticado
  IF auth.uid() IS NULL THEN
    RETURN 'anonymous';
  END IF;
  
  -- Get email using our updated function
  user_email := public.get_current_user_email();
  
  -- If no email, return anonymous
  IF user_email IS NULL OR user_email = '' THEN
    RETURN 'anonymous';
  END IF;
  
  -- Find user's role in profissionais table
  SELECT funcao INTO user_funcao
  FROM profissionais_fcmother
  WHERE email = user_email;
  
  RETURN COALESCE(user_funcao, 'colaborador');
END;
$function$;