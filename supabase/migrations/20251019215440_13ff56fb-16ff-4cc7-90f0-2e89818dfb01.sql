-- Verificar e criar política RLS para upload direto de áudio
-- Permite que usuários autenticados façam upload no bucket audio-palestras
-- com seus próprios user_id no path

DO $$
BEGIN
  -- Verificar se a política já existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own audio files'
  ) THEN
    -- Criar política de INSERT para usuários autenticados
    CREATE POLICY "Users can upload their own audio files"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'audio-palestras' 
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
    
    RAISE NOTICE 'Política RLS criada: Users can upload their own audio files';
  ELSE
    RAISE NOTICE 'Política RLS já existe: Users can upload their own audio files';
  END IF;
END $$;

-- Verificar configuração do bucket
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'audio-palestras';
