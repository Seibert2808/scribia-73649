-- FASE 1: Políticas RLS para ScribIA
-- Permitir INSERT público para cadastros de trial gratuito
-- Bloquear SELECT para proteger dados dos usuários

-- Política para permitir inserção de novos clientes (trial gratuito)
CREATE POLICY "Allow public insert for free trial signups" 
ON public.scribia_client_free 
FOR INSERT 
WITH CHECK (true);

-- Política restritiva para leitura (apenas administradores futuros)
CREATE POLICY "Restrict select access to scribia_client_free" 
ON public.scribia_client_free 
FOR SELECT 
USING (false); -- Por enquanto, nenhum acesso de leitura

-- FASE 2: Proteger tabelas do FC Mother que estão sem RLS
-- Habilitar RLS nas tabelas desprotegidas identificadas

ALTER TABLE public.insurance_payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ns_clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ns_id_pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ns_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ns_speciality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Criar políticas restritivas para bloquear acesso público às tabelas do FC Mother
-- Essas tabelas devem ser acessadas apenas por usuários autenticados do FC Mother

-- Insurance Payers - apenas usuários autenticados
CREATE POLICY "Block public access to insurance_payers" 
ON public.insurance_payers 
FOR ALL 
USING (false);

-- NS Clinics - apenas usuários autenticados
CREATE POLICY "Block public access to ns_clinics" 
ON public.ns_clinics 
FOR ALL 
USING (false);

-- NS ID Pacientes - apenas usuários autenticados
CREATE POLICY "Block public access to ns_id_pacientes" 
ON public.ns_id_pacientes 
FOR ALL 
USING (false);

-- NS Offices - apenas usuários autenticados  
CREATE POLICY "Block public access to ns_offices" 
ON public.ns_offices 
FOR ALL 
USING (false);

-- NS Speciality - apenas usuários autenticados
CREATE POLICY "Block public access to ns_speciality" 
ON public.ns_speciality 
FOR ALL 
USING (false);

-- Patient Insurance Cards - apenas usuários autenticados
CREATE POLICY "Block public access to patient_insurance_cards" 
ON public.patient_insurance_cards 
FOR ALL 
USING (false);

-- Professional Affiliations - apenas usuários autenticados
CREATE POLICY "Block public access to professional_affiliations" 
ON public.professional_affiliations 
FOR ALL 
USING (false);

-- Professionals - apenas usuários autenticados
CREATE POLICY "Block public access to professionals" 
ON public.professionals 
FOR ALL 
USING (false);