-- Create trigger to notify n8n on new client registration (only trigger, not changing column)
CREATE OR REPLACE TRIGGER scribia_client_free_trigger
  AFTER INSERT ON public.scribia_client_free
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_n8n_scribia_client_free();