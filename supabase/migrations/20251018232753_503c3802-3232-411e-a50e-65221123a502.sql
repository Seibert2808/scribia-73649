-- Atualizar bucket audio-palestras para aceitar audio/webm
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY[
    'audio/mpeg',
    'audio/mp3', 
    'audio/wav',
    'audio/m4a',
    'audio/x-m4a',
    'audio/aac',
    'audio/ogg',
    'audio/webm',
    'audio/flac',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ],
  file_size_limit = 524288000  -- 500MB
WHERE id = 'audio-palestras';

-- Garantir que o bucket existe (caso não exista ainda)
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
  'audio-palestras',
  'audio-palestras',
  true,
  ARRAY[
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/x-m4a',
    'audio/aac',
    'audio/ogg',
    'audio/webm',
    'audio/flac',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ],
  524288000
)
ON CONFLICT (id) DO UPDATE SET
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  file_size_limit = EXCLUDED.file_size_limit;