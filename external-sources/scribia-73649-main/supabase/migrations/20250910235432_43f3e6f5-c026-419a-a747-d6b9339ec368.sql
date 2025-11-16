-- Fix the sequence default for scribia_client_free table
ALTER TABLE public.scribia_client_free 
ALTER COLUMN id_client_free SET DEFAULT nextval('scribia_client_free_id_client_free_seq');

-- Create trigger to notify n8n on new client registration  
CREATE OR REPLACE TRIGGER scribia_client_free_trigger
  AFTER INSERT ON public.scribia_client_free
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_n8n_scribia_client_free();