
-- Criar trigger para inserir automaticamente o usuário na tabela scribia_usuarios
-- quando um novo usuário é criado no auth.users

-- Primeiro, remover triggers existentes se houver
DROP TRIGGER IF EXISTS on_auth_user_created_scribia ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;

-- Remover funções antigas
DROP FUNCTION IF EXISTS public.handle_new_scribia_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_role() CASCADE;

-- Criar a função que será chamada pela trigger para criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_scribia_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.scribia_usuarios (id, nome_completo, email, cpf, whatsapp)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', '')
  );
  
  -- Create free subscription by default
  INSERT INTO public.scribia_assinaturas (usuario_id, plano, status)
  VALUES (NEW.id, 'free', 'ativo');
  
  RETURN NEW;
END;
$$;

-- Criar a trigger que chama a função quando um novo usuário é criado
CREATE TRIGGER on_auth_user_created_scribia
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_scribia_user();

-- Criar a função para atribuir role de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.scribia_user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Criar a trigger para role
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();
