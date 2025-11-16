-- Limpar todos os arquivos de áudio do bucket audio-palestras
-- (mantendo o bucket para uso futuro)
DELETE FROM storage.objects 
WHERE bucket_id = 'audio-palestras';
