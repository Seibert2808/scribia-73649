-- Adicionar coluna transcricao na tabela scribia_palestras
ALTER TABLE public.scribia_palestras
ADD COLUMN IF NOT EXISTS transcricao TEXT;