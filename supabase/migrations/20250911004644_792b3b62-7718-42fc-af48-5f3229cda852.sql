-- Remove the problematic trigger that causes transaction failures
DROP TRIGGER IF EXISTS scribia_client_free_trigger ON public.scribia_client_free;

-- Drop the old function that uses incorrect syntax
DROP FUNCTION IF EXISTS public.notify_n8n_scribia_client_free();

-- Create a new function that sends complete client data to the N8N webhook
CREATE OR REPLACE FUNCTION public.notify_n8n_scribia_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'extensions'
AS $$
BEGIN
  -- Use the correct net.http_post function from extensions schema
  PERFORM net.http_post(
    url     := 'https://sabrinaseibert.app.n8n.cloud/webhook/scribia/free-client/new',
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body    := jsonb_build_object(
      'id_client_free', NEW.id_client_free,
      'name',           NEW.name,
      'email',          NEW.email,
      'whatsapp_e164',  NEW.whatsapp_e164,
      'created_at',     NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create the corrected trigger that sends complete data
CREATE TRIGGER scribia_client_webhook_trigger
  AFTER INSERT ON public.scribia_client_free
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_n8n_scribia_webhook();