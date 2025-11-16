
-- Habilitar RLS na tabela oparto_pacientes que tem políticas mas não tem RLS habilitado
ALTER TABLE public.oparto_pacientes ENABLE ROW LEVEL SECURITY;
