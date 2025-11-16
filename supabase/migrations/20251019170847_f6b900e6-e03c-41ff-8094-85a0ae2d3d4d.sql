-- Habilitar RLS e criar policies para tabelas scribia_eventos, scribia_palestras e scribia_livebooks

-- 1. Habilitar RLS na tabela scribia_eventos
ALTER TABLE public.scribia_eventos ENABLE ROW LEVEL SECURITY;

-- Policies para scribia_eventos
CREATE POLICY "Users can view their own eventos"
  ON public.scribia_eventos
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert their own eventos"
  ON public.scribia_eventos
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own eventos"
  ON public.scribia_eventos
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete their own eventos"
  ON public.scribia_eventos
  FOR DELETE
  USING (auth.uid() = usuario_id);

-- Admins podem ver todos os eventos
CREATE POLICY "Admins can view all eventos"
  ON public.scribia_eventos
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Habilitar RLS na tabela scribia_palestras
ALTER TABLE public.scribia_palestras ENABLE ROW LEVEL SECURITY;

-- Policies para scribia_palestras
CREATE POLICY "Users can view their own palestras"
  ON public.scribia_palestras
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert their own palestras"
  ON public.scribia_palestras
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own palestras"
  ON public.scribia_palestras
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete their own palestras"
  ON public.scribia_palestras
  FOR DELETE
  USING (auth.uid() = usuario_id);

-- Admins podem ver todas as palestras
CREATE POLICY "Admins can view all palestras"
  ON public.scribia_palestras
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Habilitar RLS na tabela scribia_livebooks
ALTER TABLE public.scribia_livebooks ENABLE ROW LEVEL SECURITY;

-- Policies para scribia_livebooks
CREATE POLICY "Users can view their own livebooks"
  ON public.scribia_livebooks
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can insert their own livebooks"
  ON public.scribia_livebooks
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own livebooks"
  ON public.scribia_livebooks
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can delete their own livebooks"
  ON public.scribia_livebooks
  FOR DELETE
  USING (auth.uid() = usuario_id);

-- Admins podem ver todos os livebooks
CREATE POLICY "Admins can view all livebooks"
  ON public.scribia_livebooks
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));