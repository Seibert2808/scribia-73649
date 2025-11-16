-- Create enum for tipo_resumo
CREATE TYPE tipo_resumo AS ENUM (
  'junior_completo',
  'junior_compacto',
  'pleno_completo',
  'pleno_compacto',
  'senior_completo',
  'senior_compacto'
);

-- Create enum for status_livebook
CREATE TYPE status_livebook AS ENUM (
  'aguardando',
  'transcrevendo',
  'processando',
  'concluido',
  'erro'
);

-- Create scribia_livebooks table
CREATE TABLE public.scribia_livebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palestra_id UUID NOT NULL REFERENCES public.scribia_palestras(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES public.scribia_usuarios(id) ON DELETE CASCADE,
  tipo_resumo tipo_resumo NOT NULL,
  pdf_url TEXT,
  html_url TEXT,
  docx_url TEXT,
  status status_livebook DEFAULT 'aguardando',
  tempo_processamento NUMERIC,
  erro_log TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scribia_livebooks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Usuarios podem inserir seus proprios livebooks"
  ON public.scribia_livebooks
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem ver seus proprios livebooks"
  ON public.scribia_livebooks
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar seus proprios livebooks"
  ON public.scribia_livebooks
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem excluir seus proprios livebooks"
  ON public.scribia_livebooks
  FOR DELETE
  USING (auth.uid() = usuario_id);

-- Trigger to update atualizado_em
CREATE TRIGGER update_scribia_livebooks_updated_at
  BEFORE UPDATE ON public.scribia_livebooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_scribia_updated_at();