-- FASE 2: Proteger tabelas do FC Mother que estão sem RLS
-- Apenas habilitar RLS nas tabelas que ainda não têm proteção

-- Verificar e proteger tabelas sem RLS
ALTER TABLE public.insurance_payers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ns_clinics ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.ns_id_pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ns_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ns_speciality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_affiliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- Criar políticas restritivas apenas para tabelas que não têm políticas
-- Estas políticas bloqueiam acesso público, protegendo os dados do FC Mother

CREATE POLICY "Block public access to insurance_payers" 
ON public.insurance_payers 
FOR ALL 
USING (false);

CREATE POLICY "Block public access to ns_clinics" 
ON public.ns_clinics 
FOR ALL 
USING (false);

CREATE POLICY "Block public access to ns_id_pacientes" 
ON public.ns_id_pacientes 
FOR ALL 
USING (false);

CREATE POLICY "Block public access to ns_offices" 
ON public.ns_offices 
FOR ALL 
USING (false);

CREATE POLICY "Block public access to ns_speciality" 
ON public.ns_speciality 
FOR ALL 
USING (false);

CREATE POLICY "Block public access to patient_insurance_cards" 
ON public.patient_insurance_cards 
FOR ALL 
USING (false);

CREATE POLICY "Block public access to professional_affiliations" 
ON public.professional_affiliations 
FOR ALL 
USING (false);

CREATE POLICY "Block public access to professionals" 
ON public.professionals 
FOR ALL 
USING (false);

-- Documentar o isolamento completo
COMMENT ON TABLE public.scribia_client_free IS 'ScribIA: Tabela isolada para clientes do trial gratuito. Permite INSERT público para cadastros.';
COMMENT ON TABLE public.insurance_payers IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';
COMMENT ON TABLE public.ns_clinics IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';
COMMENT ON TABLE public.ns_id_pacientes IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';
COMMENT ON TABLE public.ns_offices IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';
COMMENT ON TABLE public.ns_speciality IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';
COMMENT ON TABLE public.patient_insurance_cards IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';
COMMENT ON TABLE public.professional_affiliations IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';
COMMENT ON TABLE public.professionals IS 'FC Mother: Tabela protegida por RLS - acesso restrito a usuários autenticados do FC Mother';