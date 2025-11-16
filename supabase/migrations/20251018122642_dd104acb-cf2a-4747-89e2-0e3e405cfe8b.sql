-- Criar função genérica para atualizar atualizado_em
CREATE OR REPLACE FUNCTION public.update_atualizado_em()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover triggers antigos que usam updated_at (se existirem)
DROP TRIGGER IF EXISTS update_scribia_palestras_updated_at ON public.scribia_palestras;
DROP TRIGGER IF EXISTS update_scribia_livebooks_updated_at ON public.scribia_livebooks;
DROP TRIGGER IF EXISTS update_scribia_eventos_updated_at ON public.scribia_eventos;
DROP TRIGGER IF EXISTS update_configs_updated_at ON public.scribia_configuracoes_organizador;

-- Criar novos triggers usando atualizado_em
CREATE TRIGGER update_scribia_palestras_atualizado_em
  BEFORE UPDATE ON public.scribia_palestras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();

CREATE TRIGGER update_scribia_livebooks_atualizado_em
  BEFORE UPDATE ON public.scribia_livebooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();

CREATE TRIGGER update_scribia_eventos_atualizado_em
  BEFORE UPDATE ON public.scribia_eventos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();

CREATE TRIGGER update_configs_atualizado_em
  BEFORE UPDATE ON public.scribia_configuracoes_organizador
  FOR EACH ROW
  EXECUTE FUNCTION public.update_atualizado_em();