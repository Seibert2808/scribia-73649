-- Criar bucket para armazenar livebooks
INSERT INTO storage.buckets (id, name, public)
VALUES ('livebooks', 'livebooks', true)
ON CONFLICT (id) DO NOTHING;

-- Criar políticas RLS para o bucket livebooks
CREATE POLICY "Usuários podem fazer upload de seus livebooks"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'livebooks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Usuários podem visualizar seus próprios livebooks"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'livebooks' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Livebooks são publicamente acessíveis"
ON storage.objects
FOR SELECT
USING (bucket_id = 'livebooks');