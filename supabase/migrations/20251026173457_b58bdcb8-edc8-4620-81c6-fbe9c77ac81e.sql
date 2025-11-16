-- Aumentar limite do bucket scribia-audio para 500MB
UPDATE storage.buckets 
SET file_size_limit = 524288000 -- 500MB em bytes
WHERE name = 'scribia-audio';

-- Verificar se o bucket existe, se não, criar
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('scribia-audio', 'scribia-audio', false, 524288000)
ON CONFLICT (id) DO UPDATE 
SET file_size_limit = 524288000;