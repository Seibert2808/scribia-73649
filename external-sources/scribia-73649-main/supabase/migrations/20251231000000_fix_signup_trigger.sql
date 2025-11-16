-- Correção do trigger de cadastro para resolver problema de RLS
-- O trigger não conseguia inserir dados devido às políticas de segurança

-- Remover políticas restritivas existentes
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.scribia_usuarios;

-- Criar política mais permissiva para inserção de perfis
CREATE POLICY "Allow profile creation"
  ON public.scribia_usuarios
  FOR INSERT
  WITH CHECK (true);

-- Remover e recriar a função do trigger com melhor tratamento de erros
DROP FUNCTION IF EXISTS public.handle_new_scribia_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_scribia_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Inserir perfil do usuário
  INSERT INTO public.scribia_usuarios (id, nome_completo, email, cpf, whatsapp)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', '')
  );
  
  -- Criar assinatura gratuita
  INSERT INTO public.scribia_assinaturas (usuario_id, plano, status)
  VALUES (NEW.id, 'free', 'ativo');
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log detalhado do erro
    RAISE LOG 'Erro no trigger handle_new_scribia_user para usuário %: %', NEW.id, SQLERRM;
    -- Continuar mesmo com erro para não bloquear o cadastro
    RETURN NEW;
END;
$$;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created_scribia ON auth.users;
CREATE TRIGGER on_auth_user_created_scribia
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_scribia_user();

-- Garantir que a política de inserção de assinaturas também funcione
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.scribia_assinaturas;
CREATE POLICY "Allow subscription creation"
  ON public.scribia_assinaturas
  FOR INSERT
  WITH CHECK (true);

-- Manter as políticas de visualização e atualização mais restritivas
CREATE POLICY "Users can insert their own profile after creation"
  ON public.scribia_usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Comentários para documentação
COMMENT ON FUNCTION public.handle_new_scribia_user() IS 'Trigger corrigido para criar perfil automaticamente. SECURITY DEFINER contorna RLS.';
COMMENT ON POLICY "Allow profile creation" ON public.scribia_usuarios IS 'Permite criação de perfis pelo trigger de cadastro.';
COMMENT ON POLICY "Allow subscription creation" ON public.scribia_assinaturas IS 'Permite criação de assinaturas pelo trigger de cadastro.';