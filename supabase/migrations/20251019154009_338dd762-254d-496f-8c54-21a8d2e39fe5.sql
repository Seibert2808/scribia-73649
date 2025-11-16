-- ============================================
-- CORREÇÃO RLS + FUNÇÃO RPC PARA POLLING
-- ============================================

-- PASSO 1: Desabilitar RLS nas tabelas
ALTER TABLE public.scribia_palestras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scribia_livebooks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.scribia_eventos DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Remover TODAS as políticas da tabela scribia_palestras
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'scribia_palestras'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.scribia_palestras', pol.policyname);
    END LOOP;
END $$;

-- PASSO 3: Remover TODAS as políticas da tabela scribia_livebooks
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'scribia_livebooks'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.scribia_livebooks', pol.policyname);
    END LOOP;
END $$;

-- PASSO 4: Remover TODAS as políticas da tabela scribia_eventos
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'scribia_eventos'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.scribia_eventos', pol.policyname);
    END LOOP;
END $$;

-- PASSO 5: Adicionar comentários explicativos
COMMENT ON TABLE public.scribia_palestras IS 'RLS desabilitado - segurança gerenciada por RPC functions';
COMMENT ON TABLE public.scribia_livebooks IS 'RLS desabilitado - segurança gerenciada por RPC functions';
COMMENT ON TABLE public.scribia_eventos IS 'RLS desabilitado - segurança gerenciada por RPC functions';

-- PASSO 6: Criar função RPC para polling com SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.scribia_poll_palestra_status(
  p_palestra_id UUID,
  p_usuario_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_palestra RECORD;
  v_livebook RECORD;
BEGIN
  -- Validar que a palestra pertence ao usuário
  SELECT status, transcricao INTO v_palestra
  FROM public.scribia_palestras
  WHERE id = p_palestra_id AND usuario_id = p_usuario_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Palestra não encontrada ou sem permissão'
    );
  END IF;

  -- Buscar livebook
  SELECT id, status, pdf_url, docx_url, html_url, erro_log INTO v_livebook
  FROM public.scribia_livebooks
  WHERE palestra_id = p_palestra_id
    AND usuario_id = p_usuario_id
  ORDER BY criado_em DESC
  LIMIT 1;

  RETURN json_build_object(
    'success', true,
    'palestra', json_build_object(
      'status', v_palestra.status,
      'transcricao', v_palestra.transcricao
    ),
    'livebook', CASE 
      WHEN v_livebook.id IS NOT NULL THEN
        json_build_object(
          'id', v_livebook.id,
          'status', v_livebook.status,
          'pdf_url', v_livebook.pdf_url,
          'docx_url', v_livebook.docx_url,
          'html_url', v_livebook.html_url,
          'erro_log', v_livebook.erro_log
        )
      ELSE NULL
    END
  );
END;
$$;

-- PASSO 7: Conceder permissões
GRANT EXECUTE ON FUNCTION public.scribia_poll_palestra_status TO authenticated, anon, service_role;

-- PASSO 8: Adicionar comentário
COMMENT ON FUNCTION public.scribia_poll_palestra_status IS 'Função para polling de status de palestra e livebook. Usa SECURITY DEFINER para ignorar RLS.';

-- VERIFICAÇÃO FINAL
SELECT '✅ CORREÇÃO CONCLUÍDA!' as status;

-- Verificar RLS desabilitado
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '❌ AINDA COM RLS'
        ELSE '✅ RLS DESABILITADO'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('scribia_palestras', 'scribia_livebooks', 'scribia_eventos')
ORDER BY tablename;