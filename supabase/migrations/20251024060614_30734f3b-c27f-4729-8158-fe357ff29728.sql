-- Atualizar limite de tamanho do bucket audio-palestras para 250MB
UPDATE storage.buckets 
SET file_size_limit = 262144000 -- 250MB em bytes (250 * 1024 * 1024)
WHERE id = 'audio-palestras';

-- Se o bucket não existir, criar com limite de 250MB
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('audio-palestras', 'audio-palestras', true, 262144000)
ON CONFLICT (id) DO UPDATE 
SET file_size_limit = 262144000;