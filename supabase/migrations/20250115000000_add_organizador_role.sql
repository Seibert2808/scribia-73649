-- Add 'organizador' role to the existing app_role enum
ALTER TYPE public.app_role ADD VALUE 'organizador';

-- Create a function to check if user is organizador
CREATE OR REPLACE FUNCTION public.is_organizador(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.scribia_user_roles 
    WHERE scribia_user_roles.user_id = is_organizador.user_id 
    AND role = 'organizador'
  );
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_organizador TO authenticated;

-- Insert a dummy organizador user for testing
-- First, create the auth user
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'organizador@scribia.com',
  '$2a$10$8K1p/a0dUrZBvHEqzyTdOeEO3yvGRvJ1/m1kfIfbdezxKvxMgxZ9i', -- password: organizador123
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Organizador Teste", "avatar_url": null}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- Then assign the organizador role
INSERT INTO public.scribia_user_roles (user_id, role)
VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'organizador')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create a profile for the organizador user
INSERT INTO public.profiles (
  id,
  full_name,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Organizador Teste',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;