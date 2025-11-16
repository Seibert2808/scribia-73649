
-- Limpar todas as políticas conflitantes do bucket audio-palestras
DROP POLICY IF EXISTS "Allow authenticated audio uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload audio files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own audio" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own audio" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own audio" ON storage.objects;
DROP POLICY IF EXISTS "Public can read audio files" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to audio-palestras" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated audio reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated audio updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated audio deletes" ON storage.objects;

-- Criar política simples para upload público (compatível com auth customizado)
CREATE POLICY "Public upload to audio-palestras"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'audio-palestras');

-- Permitir leitura pública
CREATE POLICY "Public read from audio-palestras"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio-palestras');

-- Permitir update público
CREATE POLICY "Public update in audio-palestras"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'audio-palestras')
WITH CHECK (bucket_id = 'audio-palestras');

-- Permitir delete público
CREATE POLICY "Public delete from audio-palestras"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'audio-palestras');
