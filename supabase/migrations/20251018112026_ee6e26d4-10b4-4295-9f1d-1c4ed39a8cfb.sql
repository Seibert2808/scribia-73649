-- Garantir que o bucket audio-palestras existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-palestras',
  'audio-palestras',
  false,
  524288000, -- 500MB
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a', 'audio/mp4', 'video/mp4', 'video/mpeg']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/x-m4a', 'audio/mp4', 'video/mp4', 'video/mpeg'];

-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can upload their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- Criar políticas que funcionam sem auth.uid() (para sistema de auth customizado)
-- Permite INSERT para qualquer requisição autenticada
CREATE POLICY "Allow authenticated audio uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-palestras');

-- Permite SELECT para qualquer requisição autenticada
CREATE POLICY "Allow authenticated audio reads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audio-palestras');

-- Permite DELETE para qualquer requisição autenticada
CREATE POLICY "Allow authenticated audio deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'audio-palestras');

-- Permite UPDATE para qualquer requisição autenticada
CREATE POLICY "Allow authenticated audio updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'audio-palestras')
WITH CHECK (bucket_id = 'audio-palestras');