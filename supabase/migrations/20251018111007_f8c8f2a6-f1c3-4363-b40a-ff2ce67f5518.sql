-- Remove políticas antigas do Storage para scribia-audio
DROP POLICY IF EXISTS "Users can upload their own audio" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own audio" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own audio" ON storage.objects;

-- Remove políticas antigas do Storage para scribia-slides
DROP POLICY IF EXISTS "Users can upload their own slides" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own slides" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own slides" ON storage.objects;

-- Criar novas políticas para scribia-audio
CREATE POLICY "Allow authenticated users to upload audio"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'scribia-audio'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.scribia_usuarios
  )
);

CREATE POLICY "Allow authenticated users to view audio"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'scribia-audio'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.scribia_usuarios
  )
);

CREATE POLICY "Allow authenticated users to delete audio"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'scribia-audio'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.scribia_usuarios
  )
);

-- Criar novas políticas para scribia-slides
CREATE POLICY "Allow authenticated users to upload slides"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'scribia-slides'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.scribia_usuarios
  )
);

CREATE POLICY "Allow authenticated users to view slides"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'scribia-slides'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.scribia_usuarios
  )
);

CREATE POLICY "Allow authenticated users to delete slides"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'scribia-slides'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.scribia_usuarios
  )
);