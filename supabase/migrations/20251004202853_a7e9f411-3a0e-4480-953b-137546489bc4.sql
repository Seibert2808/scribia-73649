-- Create table for Tutor ScribIA chat sessions
CREATE TABLE IF NOT EXISTS public.scribia_tutor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scribia_tutor_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own sessions
CREATE POLICY "Usuarios podem ver suas proprias sessoes"
  ON public.scribia_tutor_sessions
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem inserir suas proprias sessoes"
  ON public.scribia_tutor_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem deletar suas proprias sessoes"
  ON public.scribia_tutor_sessions
  FOR DELETE
  USING (auth.uid() = usuario_id);

-- Create index for better query performance
CREATE INDEX idx_tutor_sessions_usuario_id ON public.scribia_tutor_sessions(usuario_id);
CREATE INDEX idx_tutor_sessions_criado_em ON public.scribia_tutor_sessions(criado_em DESC);