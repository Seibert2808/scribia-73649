-- Organização das tabelas por projeto
-- FC Mother: mantém nomes atuais (já são específicos com prefixos ns_, pos_parto, etc.)
-- ScribIA: todas as tabelas devem ter prefixo scribia_

-- A tabela scribia_client_free já está correta
-- Vamos apenas adicionar um comentário para documentar a estrutura

COMMENT ON TABLE public.scribia_client_free IS 'ScribIA: Tabela de clientes do trial gratuito do ScribIA';

-- Criar uma view para documentar a separação dos projetos
CREATE OR REPLACE VIEW public.project_tables_info AS
SELECT 
    table_name,
    CASE 
        WHEN table_name LIKE 'scribia_%' THEN 'ScribIA'
        WHEN table_name LIKE 'ns_%' OR table_name IN ('pos_parto', 'profissionais_fcmother', 'patients', 'oparto_autenticacao') THEN 'FC Mother'
        ELSE 'Shared/Other'
    END as project,
    CASE 
        WHEN table_name LIKE 'scribia_%' THEN 'Correto'
        WHEN table_name LIKE 'ns_%' OR table_name IN ('pos_parto', 'profissionais_fcmother') THEN 'Específico FC Mother'
        ELSE 'Verificar nomenclatura'
    END as naming_status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY project, table_name;