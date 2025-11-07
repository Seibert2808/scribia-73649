-- Criar tabela para contatos de organizadores de eventos
CREATE TABLE public.scribia_contato_organizador (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_evento TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  total_participantes INTEGER NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.scribia_contato_organizador ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública (para formulário de contato)
CREATE POLICY "Allow public insert for organizer contact"
ON public.scribia_contato_organizador
FOR INSERT
TO public
WITH CHECK (true);

-- Apenas admins podem visualizar
CREATE POLICY "Admins can view organizer contacts"
ON public.scribia_contato_organizador
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar índice no email para busca
CREATE INDEX idx_scribia_contato_organizador_email ON public.scribia_contato_organizador(email);

-- Criar índice na data de criação
CREATE INDEX idx_scribia_contato_organizador_criado_em ON public.scribia_contato_organizador(criado_em DESC);