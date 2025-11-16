-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can upload their own audio files" ON storage.objects;
DROP POLICY IF EXISTS "Public can read audio files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload audio files" ON storage.objects;

-- Criar nova política RLS permissiva para upload
-- Permite upload no bucket audio-palestras para qualquer usuário autenticado
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-palestras'
);

-- Política para leitura pública (o bucket já é público)
CREATE POLICY "Public can read audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-palestras');

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd,
  roles::text,
  with_check::text
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%audio%'
ORDER BY policyname;
