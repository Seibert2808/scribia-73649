-- CORREÇÃO FINAL: Remover view desnecessária que pode estar causando o problema
-- A view project_tables_info foi criada apenas para documentação e não é necessária

-- 1. Remover a view project_tables_info
DROP VIEW IF EXISTS public.project_tables_info;

-- 2. O ScribIA não precisa dessa view - o isolamento já foi documentado nos comentários das tabelas
-- A separação entre projetos está clara através dos comentários nas tabelas individuais

-- 3. Verificar se precisamos manter alguma documentação alternativa
-- Como o ScribIA usa apenas scribia_client_free, não precisamos de view de mapeamento

-- Adicionar comentário final de isolamento
COMMENT ON SCHEMA public IS 'Schema público contendo tabelas isoladas: ScribIA (scribia_*) e FC Mother (demais tabelas com RLS restritivo)';