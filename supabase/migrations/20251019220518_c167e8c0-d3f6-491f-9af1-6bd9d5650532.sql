
-- Remover TODAS as políticas do bucket audio-palestras para evitar conflitos
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
          AND tablename = 'objects'
          AND (qual::text LIKE '%audio-palestras%' OR with_check::text LIKE '%audio-palestras%')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Criar políticas públicas simples (compatível com auth customizado)
CREATE POLICY "audio_palestras_public_insert"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'audio-palestras');

CREATE POLICY "audio_palestras_public_select"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio-palestras');

CREATE POLICY "audio_palestras_public_update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'audio-palestras')
WITH CHECK (bucket_id = 'audio-palestras');

CREATE POLICY "audio_palestras_public_delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'audio-palestras');
