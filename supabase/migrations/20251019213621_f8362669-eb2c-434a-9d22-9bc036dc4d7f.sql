-- Aumentar limite de tamanho do bucket audio-palestras para 2GB
UPDATE storage.buckets
SET file_size_limit = 2147483648  -- 2GB em bytes
WHERE id = 'audio-palestras';

-- Verificar configuração
SELECT id, name, file_size_limit, allowed_mime_types, public
FROM storage.buckets
WHERE id = 'audio-palestras';