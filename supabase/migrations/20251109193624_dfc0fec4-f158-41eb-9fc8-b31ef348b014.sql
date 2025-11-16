-- Adicionar coluna evento_associado na tabela scribia_usuarios
ALTER TABLE public.scribia_usuarios 
ADD COLUMN IF NOT EXISTS evento_associado TEXT;

-- Migrar role 'user' existente para 'participante_evento'
UPDATE public.scribia_user_roles 
SET role = 'participante_evento'::app_role 
WHERE role = 'user'::app_role;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_scribia_usuarios_evento_associado 
ON public.scribia_usuarios(evento_associado) 
WHERE evento_associado IS NOT NULL;

-- Atualizar função scribia_get_user para retornar evento_associado
CREATE OR REPLACE FUNCTION public.scribia_get_user(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_user record;
  v_subscription record;
  v_roles text[];
BEGIN
  SELECT * INTO v_user 
  FROM public.scribia_usuarios 
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;

  SELECT * INTO v_subscription
  FROM public.scribia_assinaturas
  WHERE usuario_id = v_user.id;

  SELECT array_agg(role) INTO v_roles
  FROM public.scribia_user_roles
  WHERE user_id = v_user.id;

  RETURN json_build_object(
    'success', true,
    'user', json_build_object(
      'id', v_user.id,
      'nome_completo', v_user.nome_completo,
      'email', v_user.email,
      'cpf', v_user.cpf,
      'whatsapp', v_user.whatsapp,
      'email_verificado', v_user.email_verificado,
      'ultimo_login', v_user.ultimo_login,
      'criado_em', v_user.criado_em,
      'nivel_preferido', v_user.nivel_preferido,
      'formato_preferido', v_user.formato_preferido,
      'perfil_definido', v_user.perfil_definido,
      'perfil_definido_em', v_user.perfil_definido_em,
      'evento_associado', v_user.evento_associado,
      'roles', COALESCE(v_roles, ARRAY['participante_evento'])
    ),
    'subscription', json_build_object(
      'id', v_subscription.id,
      'plano', v_subscription.plano,
      'status', v_subscription.status,
      'renovacao_em', v_subscription.renovacao_em
    )
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$function$;

-- Criar função para atualizar evento_associado
CREATE OR REPLACE FUNCTION public.scribia_update_evento_associado(
  p_user_id uuid,
  p_evento_associado text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.scribia_usuarios
  SET evento_associado = p_evento_associado
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Evento associado atualizado com sucesso'
  );
END;
$function$;

-- Criar função para salvar role e evento durante signup
CREATE OR REPLACE FUNCTION public.scribia_set_user_role_and_event(
  p_user_id uuid,
  p_role app_role,
  p_evento_associado text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Inserir ou atualizar role
  INSERT INTO public.scribia_user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Atualizar evento_associado se fornecido
  IF p_evento_associado IS NOT NULL THEN
    UPDATE public.scribia_usuarios
    SET evento_associado = p_evento_associado
    WHERE id = p_user_id;
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Role e evento salvos com sucesso'
  );
END;
$function$;

COMMENT ON COLUMN public.scribia_usuarios.evento_associado IS 'Nome do evento associado ao usuário (opcional, pode ser editado posteriormente)';