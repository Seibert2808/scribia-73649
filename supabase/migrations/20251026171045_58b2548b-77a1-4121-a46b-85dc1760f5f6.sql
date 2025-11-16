-- Aumentar limite do bucket audio-palestras para 500MB
UPDATE storage.buckets 
SET file_size_limit = 524288000,
    public = true
WHERE id = 'audio-palestras';

-- Se não existir, criar
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('audio-palestras', 'audio-palestras', true, 524288000)
ON CONFLICT (id) DO UPDATE 
SET file_size_limit = 524288000,
    public = true;

-- Garantir acesso público para Deepgram ler os arquivos
DROP POLICY IF EXISTS "Public Access for Deepgram" ON storage.objects;

CREATE POLICY "Public Access for Deepgram"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-palestras');