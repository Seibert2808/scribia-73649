-- Migrar usuário órfão com tratamento adequado de conflitos
-- Email: sabrinalinsseibert@gmail.com

DO $$
DECLARE
  v_user_id uuid := '137466b7-a5c0-4544-af20-d90b4a685056';
  v_email text := 'sabrinalinsseibert@gmail.com';
  v_nome text := 'Sabrina Seibert';
  v_created_at timestamptz := '2025-08-10 03:58:41.943186+00';
  v_existing_id uuid;
BEGIN
  -- Verificar se já existe usuário com este email em scribia_usuarios
  SELECT id INTO v_existing_id
  FROM public.scribia_usuarios
  WHERE email = v_email;

  IF v_existing_id IS NOT NULL AND v_existing_id != v_user_id THEN
    -- Email já pertence a outro ID - resolver conflito
    RAISE WARNING 'Email % já existe com ID diferente: %. Atualizando...', v_email, v_existing_id;
    
    -- Deletar registros antigos do ID conflitante
    DELETE FROM public.scribia_user_roles WHERE user_id = v_existing_id;
    DELETE FROM public.scribia_assinaturas WHERE usuario_id = v_existing_id;
    DELETE FROM public.scribia_usuarios WHERE id = v_existing_id;
  END IF;

  -- Inserir usuário em scribia_usuarios
  INSERT INTO public.scribia_usuarios (
    id, 
    nome_completo, 
    email, 
    email_verificado, 
    criado_em,
    cpf,
    whatsapp
  )
  VALUES (
    v_user_id,
    v_nome,
    v_email,
    true,
    v_created_at,
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    email = EXCLUDED.email,
    email_verificado = EXCLUDED.email_verificado;

  RAISE NOTICE 'Usuário inserido em scribia_usuarios: %', v_email;

  -- Criar assinatura gratuita
  INSERT INTO public.scribia_assinaturas (
    usuario_id,
    plano,
    status,
    criado_em
  )
  VALUES (
    v_user_id,
    'free',
    'ativo',
    v_created_at
  )
  ON CONFLICT (usuario_id) DO NOTHING;

  RAISE NOTICE 'Assinatura criada para: %', v_email;

  -- Criar role de usuário
  INSERT INTO public.scribia_user_roles (
    user_id,
    role,
    created_at
  )
  VALUES (
    v_user_id,
    'user',
    v_created_at
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RAISE NOTICE 'Role criada para: %', v_email;
  RAISE NOTICE '✓ Migração concluída com sucesso para: %', v_email;

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro na migração: %', SQLERRM;
END $$;

-- Relatório final de sincronização
SELECT 
  'Sincronização Completa' as status,
  COUNT(DISTINCT au.id) as usuarios_auth,
  COUNT(DISTINCT su.id) as usuarios_scribia,
  COUNT(DISTINCT sa.usuario_id) as usuarios_com_assinatura,
  COUNT(DISTINCT sur.user_id) as usuarios_com_roles
FROM auth.users au
LEFT JOIN public.scribia_usuarios su ON au.id = su.id
LEFT JOIN public.scribia_assinaturas sa ON au.id = sa.usuario_id
LEFT JOIN public.scribia_user_roles sur ON au.id = sur.user_id;