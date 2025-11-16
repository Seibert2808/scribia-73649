
-- Atualizar bucket para o limite máximo permitido (50GB)
UPDATE storage.buckets
SET file_size_limit = 53687091200  -- 50GB em bytes
WHERE id = 'audio-palestras';

-- Verificar atualização
SELECT 
  id, 
  name, 
  file_size_limit,
  file_size_limit / 1024 / 1024 / 1024 as limite_gb,
  public,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'audio-palestras';
