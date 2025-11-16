-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.scribia_notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES public.scribia_usuarios(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('livebook', 'evento', 'palestra', 'sistema')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  link TEXT,
  lida BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lida_em TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_tipo CHECK (tipo IN ('livebook', 'evento', 'palestra', 'sistema'))
);

-- Índices para performance
CREATE INDEX idx_notificacoes_usuario ON public.scribia_notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_lida ON public.scribia_notificacoes(usuario_id, lida);
CREATE INDEX idx_notificacoes_criado ON public.scribia_notificacoes(usuario_id, criado_em DESC);

-- Habilitar RLS
ALTER TABLE public.scribia_notificacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver suas próprias notificações"
  ON public.scribia_notificacoes FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem marcar suas notificações como lidas"
  ON public.scribia_notificacoes FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Função RPC para marcar notificação como lida
CREATE OR REPLACE FUNCTION public.scribia_mark_notification_read(p_notificacao_id UUID, p_usuario_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificar se a notificação pertence ao usuário
  IF NOT EXISTS (
    SELECT 1 FROM public.scribia_notificacoes
    WHERE id = p_notificacao_id AND usuario_id = p_usuario_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Notificação não encontrada'
    );
  END IF;

  -- Marcar como lida
  UPDATE public.scribia_notificacoes
  SET lida = TRUE, lida_em = NOW()
  WHERE id = p_notificacao_id AND usuario_id = p_usuario_id;

  RETURN json_build_object('success', true);
END;
$$;

-- Função RPC para marcar todas as notificações como lidas
CREATE OR REPLACE FUNCTION public.scribia_mark_all_notifications_read(p_usuario_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Marcar todas as notificações não lidas como lidas
  UPDATE public.scribia_notificacoes
  SET lida = TRUE, lida_em = NOW()
  WHERE usuario_id = p_usuario_id AND lida = FALSE;

  RETURN json_build_object('success', true);
END;
$$;

-- Função RPC para buscar notificações
CREATE OR REPLACE FUNCTION public.scribia_get_notifications(p_usuario_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_notifications JSON;
  v_unread_count INTEGER;
BEGIN
  -- Contar notificações não lidas
  SELECT COUNT(*) INTO v_unread_count
  FROM public.scribia_notificacoes
  WHERE usuario_id = p_usuario_id AND lida = FALSE;

  -- Buscar notificações recentes
  SELECT json_agg(
    json_build_object(
      'id', id,
      'tipo', tipo,
      'titulo', titulo,
      'mensagem', mensagem,
      'link', link,
      'lida', lida,
      'criado_em', criado_em,
      'lida_em', lida_em
    ) ORDER BY criado_em DESC
  )
  INTO v_notifications
  FROM public.scribia_notificacoes
  WHERE usuario_id = p_usuario_id
  ORDER BY criado_em DESC
  LIMIT p_limit;

  RETURN json_build_object(
    'success', true,
    'unread_count', v_unread_count,
    'notifications', COALESCE(v_notifications, '[]'::json)
  );
END;
$$;

-- Habilitar replicação em tempo real
ALTER TABLE public.scribia_notificacoes REPLICA IDENTITY FULL;