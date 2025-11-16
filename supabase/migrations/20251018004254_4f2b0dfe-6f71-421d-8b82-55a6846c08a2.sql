-- Atualizar função de signup para gerar token de verificação
CREATE OR REPLACE FUNCTION public.scribia_signup(
  p_nome_completo text,
  p_email text,
  p_senha text,
  p_cpf text DEFAULT NULL,
  p_whatsapp text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_user_id uuid;
  v_senha_hash text;
  v_token text;
BEGIN
  -- Verificar se email já existe
  IF EXISTS (SELECT 1 FROM public.scribia_usuarios WHERE email = p_email) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Este email já está cadastrado'
    );
  END IF;

  -- Gerar hash da senha
  v_senha_hash := crypt(p_senha, gen_salt('bf'));
  
  -- Gerar UUID para o usuário
  v_user_id := gen_random_uuid();

  -- Gerar token de verificação
  v_token := encode(gen_random_bytes(32), 'hex');

  -- Inserir usuário com email NÃO verificado
  INSERT INTO public.scribia_usuarios (
    id, nome_completo, email, cpf, whatsapp, senha_hash, 
    email_verificado, token_verificacao, criado_em
  ) VALUES (
    v_user_id, p_nome_completo, p_email, p_cpf, p_whatsapp, v_senha_hash,
    FALSE, v_token, now()
  );

  -- Criar assinatura gratuita
  INSERT INTO public.scribia_assinaturas (usuario_id, plano, status)
  VALUES (v_user_id, 'free', 'ativo');

  -- Criar role de usuário padrão
  INSERT INTO public.scribia_user_roles (user_id, role)
  VALUES (v_user_id, 'user');

  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'verification_token', v_token,
    'message', 'Usuário criado com sucesso'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$function$;

-- Garantir que email_verificado tenha default FALSE
ALTER TABLE public.scribia_usuarios 
  ALTER COLUMN email_verificado SET DEFAULT false;

-- Atualizar função de login para verificar email
CREATE OR REPLACE FUNCTION public.scribia_login(
  p_email text,
  p_senha text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_user record;
  v_subscription record;
  v_roles text[];
BEGIN
  -- Buscar usuário
  SELECT * INTO v_user 
  FROM public.scribia_usuarios 
  WHERE email = p_email;

  -- Verificar se usuário existe
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email ou senha incorretos'
    );
  END IF;

  -- Verificar se email foi verificado
  IF NOT v_user.email_verificado THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Por favor, verifique seu email antes de fazer login'
    );
  END IF;

  -- Verificar senha
  IF NOT (v_user.senha_hash = crypt(p_senha, v_user.senha_hash)) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email ou senha incorretos'
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

  -- Atualizar último login
  UPDATE public.scribia_usuarios 
  SET ultimo_login = now() 
  WHERE id = v_user.id;

  -- Retornar dados do usuário
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
$function$;