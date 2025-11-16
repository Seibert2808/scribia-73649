-- ==============================================================================
-- FASE 1: CORRIGIR TABELA scribia_eventos (updated_at + trigger)
-- ==============================================================================

-- 1. Adicionar coluna updated_at se não existir
ALTER TABLE public.scribia_eventos
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Criar função de trigger
CREATE OR REPLACE FUNCTION public.update_scribia_eventos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Remover trigger antigo se existir
DROP TRIGGER IF EXISTS update_scribia_eventos_updated_at_trigger ON public.scribia_eventos;

-- 4. Criar novo trigger
CREATE TRIGGER update_scribia_eventos_updated_at_trigger
BEFORE UPDATE ON public.scribia_eventos
FOR EACH ROW
EXECUTE FUNCTION public.update_scribia_eventos_updated_at();

-- ==============================================================================
-- FASE 2: CORRIGIR RLS EM scribia_palestras (INSERT policy)
-- ==============================================================================

-- 1. Remover policies antigas incorretas
DROP POLICY IF EXISTS "Enable all for palestras" ON public.scribia_palestras;

-- 2. Recriar policy de INSERT correto (DROP + CREATE)
DROP POLICY IF EXISTS "palestras_insert_own" ON public.scribia_palestras;

CREATE POLICY "palestras_insert_own" ON public.scribia_palestras
FOR INSERT
WITH CHECK (usuario_id::text = auth.uid()::text);

-- ==============================================================================
-- FASE 3: ADICIONAR COLUNAS DE PREFERÊNCIA EM scribia_usuarios
-- ==============================================================================

-- 1. Adicionar colunas de preferência se não existirem
ALTER TABLE public.scribia_usuarios
ADD COLUMN IF NOT EXISTS nivel_preferido TEXT CHECK (nivel_preferido IN ('junior', 'pleno', 'senior')),
ADD COLUMN IF NOT EXISTS formato_preferido TEXT CHECK (formato_preferido IN ('compacto', 'completo')),
ADD COLUMN IF NOT EXISTS perfil_definido BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS perfil_definido_em TIMESTAMPTZ;

-- ==============================================================================
-- FASE 5: CRIAR RPC PARA SALVAR PREFERÊNCIAS NO BANCO
-- ==============================================================================

-- Drop da função antiga (para evitar conflito de tipo de retorno)
DROP FUNCTION IF EXISTS public.scribia_update_profile(uuid, text, text);

-- Criar nova função RPC para atualizar preferências de perfil
CREATE FUNCTION public.scribia_update_profile(
  p_user_id UUID,
  p_nivel TEXT,
  p_formato TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Validar nível
  IF p_nivel NOT IN ('junior', 'pleno', 'senior') THEN
    RETURN JSON_BUILD_OBJECT(
      'success', FALSE,
      'error', 'Nível inválido. Use: junior, pleno ou senior'
    );
  END IF;

  -- Validar formato
  IF p_formato NOT IN ('compacto', 'completo') THEN
    RETURN JSON_BUILD_OBJECT(
      'success', FALSE,
      'error', 'Formato inválido. Use: compacto ou completo'
    );
  END IF;

  -- Atualizar preferências
  UPDATE public.scribia_usuarios
  SET 
    nivel_preferido = p_nivel,
    formato_preferido = p_formato,
    perfil_definido = TRUE,
    perfil_definido_em = NOW(),
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Verificar se o UPDATE afetou alguma linha
  IF NOT FOUND THEN
    RETURN JSON_BUILD_OBJECT(
      'success', FALSE,
      'error', 'Usuário não encontrado'
    );
  END IF;

  -- Retornar resultado
  SELECT JSON_BUILD_OBJECT(
    'success', TRUE,
    'message', 'Preferências salvas com sucesso',
    'user_id', p_user_id,
    'nivel', p_nivel,
    'formato', p_formato,
    'tipo_resumo', p_nivel || '_' || p_formato
  ) INTO v_result;

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN JSON_BUILD_OBJECT(
    'success', FALSE,
    'error', SQLERRM
  );
END;
$$;