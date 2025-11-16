-- Corrigir configuração do bucket audio-palestras para acesso público
-- Tornar bucket público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'audio-palestras';

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Public Access to audio-palestras" ON storage.objects;

-- Criar política de leitura pública para objetos do bucket
CREATE POLICY "Public Access to audio-palestras"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio-palestras');