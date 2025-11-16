-- CORREÇÃO ADICIONAL: Resolver questões restantes de Security Definer View
-- Atualizar todas as funções para ter search_path adequado

-- 1. Identificar e corrigir funções sem search_path definido
-- Atualizar a função handle_new_user para ter search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    INSERT INTO oparto_autenticacao (id, nome_completo, email, whatsapp)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'whatsapp', '')
    );
    RETURN NEW;
END;
$function$;

-- 2. Verificar se existem outras funções que precisam de search_path
-- Atualizar update_updated_at_column se necessário
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 3. Atualizar ns_set_updated_at se necessário
CREATE OR REPLACE FUNCTION public.ns_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end; 
$function$;

-- 4. Verificar e corrigir set_updated_at se necessário
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
begin 
  new.updated_at = now(); 
  return new; 
end; 
$function$;

-- 5. Documentar as correções
COMMENT ON FUNCTION public.handle_new_user() IS 'FC Mother: Trigger SECURITY DEFINER para processar novos usuários. Acesso restrito e search_path definido.';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Função trigger para atualizar timestamp automaticamente. Search_path definido para segurança.';
COMMENT ON FUNCTION public.ns_set_updated_at() IS 'FC Mother: Função trigger para atualizar timestamp automaticamente. Search_path definido para segurança.';
COMMENT ON FUNCTION public.set_updated_at() IS 'Função trigger para atualizar timestamp automaticamente. Search_path definido para segurança.';