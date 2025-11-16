-- ============================================
-- FASE 1: HABILITAR RLS NAS TABELAS CRÍTICAS
-- ============================================

-- 1. Habilitar RLS
ALTER TABLE public.scribia_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scribia_palestras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scribia_livebooks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FASE 2: CRIAR TABELA DE CONFIGURAÇÕES DO ORGANIZADOR
-- ============================================

CREATE TABLE IF NOT EXISTS public.scribia_configuracoes_organizador (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL UNIQUE,
  
  -- DADOS PESSOAIS
  nome_completo TEXT,
  email_pessoal TEXT,
  telefone_pessoal TEXT,
  data_nascimento DATE,
  cpf_pessoal TEXT,
  rg TEXT,
  
  -- DADOS EMPRESARIAIS
  nome_empresa TEXT,
  cnpj TEXT,
  inscricao_estadual TEXT,
  razao_social TEXT,
  endereco_comercial TEXT,
  numero_endereco TEXT,
  complemento_endereco TEXT,
  bairro_endereco TEXT,
  cidade_comercial TEXT,
  estado_comercial TEXT,
  cep_comercial TEXT,
  telefone_comercial TEXT,
  email_comercial TEXT,
  website TEXT,
  logo_url TEXT,
  
  -- DADOS BANCÁRIOS
  banco TEXT,
  agencia TEXT,
  conta TEXT,
  tipo_conta TEXT CHECK (tipo_conta IN ('corrente', 'poupanca')),
  titular TEXT,
  cpf_titular TEXT,
  pix TEXT,
  
  -- CONFIGURAÇÕES DE NOTIFICAÇÃO
  notificacoes_email BOOLEAN DEFAULT true,
  notificacoes_whatsapp BOOLEAN DEFAULT true,
  relatorios_automaticos BOOLEAN DEFAULT true,
  compartilhar_dados_anonimos BOOLEAN DEFAULT false,
  
  -- METADADOS
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW(),
  
  -- ADICIONAR CONSTRAINT DE FOREIGN KEY
  CONSTRAINT fk_usuario_id FOREIGN KEY (usuario_id) 
    REFERENCES scribia_usuarios(id) ON DELETE RESTRICT
);

-- ============================================
-- HABILITAR RLS NA NOVA TABELA
-- ============================================

ALTER TABLE public.scribia_configuracoes_organizador ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CRIAR POLICIES (Users veem apenas seus dados)
-- ============================================

-- Policy: SELECT (user só vê suas config)
CREATE POLICY "Users can view own config"
ON public.scribia_configuracoes_organizador
FOR SELECT
USING (auth.uid() = usuario_id);

-- Policy: INSERT (user só insere suas config)
CREATE POLICY "Users can insert own config"
ON public.scribia_configuracoes_organizador
FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

-- Policy: UPDATE (user só atualiza suas config)
CREATE POLICY "Users can update own config"
ON public.scribia_configuracoes_organizador
FOR UPDATE
USING (auth.uid() = usuario_id)
WITH CHECK (auth.uid() = usuario_id);

-- Policy: DELETE (user só deleta suas config)
CREATE POLICY "Users can delete own config"
ON public.scribia_configuracoes_organizador
FOR DELETE
USING (auth.uid() = usuario_id);

-- ============================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX idx_configs_usuario_id ON public.scribia_configuracoes_organizador(usuario_id);
CREATE INDEX idx_configs_atualizado_em ON public.scribia_configuracoes_organizador(atualizado_em DESC);

-- ============================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ============================================

CREATE TRIGGER update_configs_updated_at
BEFORE UPDATE ON public.scribia_configuracoes_organizador
FOR EACH ROW
EXECUTE FUNCTION public.update_scribia_updated_at();