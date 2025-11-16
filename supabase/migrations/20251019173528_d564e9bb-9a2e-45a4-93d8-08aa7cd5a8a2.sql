-- Adicionar policy RLS para permitir que organizadores vejam palestras de seus eventos
CREATE POLICY "Users can view palestras from their events"
ON scribia_palestras FOR SELECT
USING (
  evento_id IN (
    SELECT id FROM scribia_eventos 
    WHERE usuario_id = auth.uid()
  )
);