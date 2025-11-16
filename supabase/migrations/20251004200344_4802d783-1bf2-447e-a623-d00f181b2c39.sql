-- Create enum types for palestras
CREATE TYPE nivel_conhecimento AS ENUM ('junior', 'pleno', 'senior');
CREATE TYPE formato_palestra AS ENUM ('completo', 'compacto');
CREATE TYPE origem_classificacao AS ENUM ('auto', 'manual');
CREATE TYPE status_palestra AS ENUM ('aguardando', 'processando', 'concluido', 'erro');

-- Create scribia_palestras table
CREATE TABLE public.scribia_palestras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID NOT NULL REFERENCES public.scribia_eventos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES public.scribia_usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  palestrante TEXT,
  tags_tema TEXT[],
  nivel_escolhido nivel_conhecimento,
  formato_escolhido formato_palestra,
  origem_classificacao origem_classificacao DEFAULT 'manual',
  confidence FLOAT,
  webhook_destino TEXT,
  status status_palestra DEFAULT 'aguardando',
  audio_url TEXT,
  slides_url TEXT,
  transcricao_url TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scribia_palestras ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Usuarios podem inserir suas proprias palestras"
  ON public.scribia_palestras
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem ver suas proprias palestras"
  ON public.scribia_palestras
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem atualizar suas proprias palestras"
  ON public.scribia_palestras
  FOR UPDATE
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios podem excluir suas proprias palestras"
  ON public.scribia_palestras
  FOR DELETE
  USING (auth.uid() = usuario_id);

-- Trigger to update atualizado_em
CREATE TRIGGER update_scribia_palestras_updated_at
  BEFORE UPDATE ON public.scribia_palestras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_scribia_updated_at();

-- Create storage buckets for audio and slides
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('scribia-audio', 'scribia-audio', false),
  ('scribia-slides', 'scribia-slides', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for audio bucket
CREATE POLICY "Users can upload their own audio"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'scribia-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own audio"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'scribia-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own audio"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'scribia-audio' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for slides bucket
CREATE POLICY "Users can upload their own slides"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'scribia-slides' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own slides"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'scribia-slides' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own slides"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'scribia-slides' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );