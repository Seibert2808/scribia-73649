-- Atualizar função scribia_get_user para incluir campos de perfil
CREATE OR REPLACE FUNCTION public.scribia_get_user(
  p_user_id uuid
) RETURNS json AS $$
DECLARE
  v_user record;
  v_subscription record;
  v_roles text[];
BEGIN
  -- Buscar usuário
  SELECT * INTO v_user 
  FROM public.scribia_usuarios 
  WHERE id = p_user_id;

  -- Verificar se usuário existe
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;

  -- Buscar assinatura
  SELECT * INTO v_subscription
  FROM public.scribia_assinaturas
  WHERE usuario_id = v_user.id;

  -- Buscar roles do usuário
  SELECT array_agg(role) INTO v_roles
  FROM public.scribia_user_roles
  WHERE user_id = v_user.id;

  -- Retornar dados completos incluindo preferências de perfil
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
      'roles', COALESCE(v_roles, ARRAY['user'])
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.scribia_get_user IS 'Função para buscar dados completos do usuário incluindo preferências de perfil';