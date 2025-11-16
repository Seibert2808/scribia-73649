-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.scribia_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.scribia_user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.scribia_user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.scribia_user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
  ON public.scribia_user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update existing RLS policies to allow admin access

-- scribia_eventos: Admins can see and manage all events
CREATE POLICY "Admins podem ver todos os eventos"
  ON public.scribia_eventos
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem gerenciar todos os eventos"
  ON public.scribia_eventos
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- scribia_palestras: Admins can see and manage all palestras
CREATE POLICY "Admins podem ver todas as palestras"
  ON public.scribia_palestras
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem gerenciar todas as palestras"
  ON public.scribia_palestras
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- scribia_livebooks: Admins can see and manage all livebooks
CREATE POLICY "Admins podem ver todos os livebooks"
  ON public.scribia_livebooks
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem gerenciar todos os livebooks"
  ON public.scribia_livebooks
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- scribia_usuarios: Admins can see all users
CREATE POLICY "Admins podem ver todos os usuarios"
  ON public.scribia_usuarios
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- scribia_assinaturas: Admins can see all subscriptions
CREATE POLICY "Admins podem ver todas as assinaturas"
  ON public.scribia_assinaturas
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem gerenciar todas as assinaturas"
  ON public.scribia_assinaturas
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- scribia_tutor_sessions: Admins can see all sessions
CREATE POLICY "Admins podem ver todas as sessoes"
  ON public.scribia_tutor_sessions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.scribia_user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.scribia_user_roles(role);

-- Trigger to auto-assign 'user' role to new users
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.scribia_user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- Helper function to check if current user is admin (for frontend use)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;