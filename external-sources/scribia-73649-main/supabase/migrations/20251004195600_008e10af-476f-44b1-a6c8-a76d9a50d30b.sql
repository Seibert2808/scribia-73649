-- Create scribia_eventos table
CREATE TABLE public.scribia_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.scribia_usuarios(id) ON DELETE CASCADE,
  nome_evento text NOT NULL,
  data_inicio date,
  data_fim date,
  cidade text,
  estado text,
  pais text,
  observacoes text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scribia_eventos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Usuarios podem inserir seus proprios eventos"
  ON public.scribia_eventos
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem ver seus proprios eventos"
  ON public.scribia_eventos
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar seus proprios eventos"
  ON public.scribia_eventos
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem excluir seus proprios eventos"
  ON public.scribia_eventos
  FOR DELETE
  USING (auth.uid() = usuario_id);

-- Trigger for updated_at
CREATE TRIGGER update_scribia_eventos_updated_at
  BEFORE UPDATE ON public.scribia_eventos
  FOR EACH ROW EXECUTE FUNCTION public.update_scribia_updated_at();