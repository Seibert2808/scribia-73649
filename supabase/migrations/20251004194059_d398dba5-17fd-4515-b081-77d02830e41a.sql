-- Create scribia_usuarios table (profiles linked to auth.users)
CREATE TABLE public.scribia_usuarios (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo text NOT NULL,
  cpf text,
  email text UNIQUE NOT NULL,
  whatsapp text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create scribia_assinaturas table
CREATE TABLE public.scribia_assinaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL REFERENCES public.scribia_usuarios(id) ON DELETE CASCADE,
  plano text NOT NULL DEFAULT 'free' CHECK (plano IN ('free', 'plus_mensal', 'plus_anual')),
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pendente')),
  stripe_customer_id text,
  renovacao_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE(usuario_id)
);

-- Enable RLS
ALTER TABLE public.scribia_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scribia_assinaturas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scribia_usuarios
CREATE POLICY "Users can view their own profile"
  ON public.scribia_usuarios
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.scribia_usuarios
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.scribia_usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for scribia_assinaturas
CREATE POLICY "Users can view their own subscription"
  ON public.scribia_assinaturas
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own subscription"
  ON public.scribia_assinaturas
  FOR UPDATE
  USING (auth.uid() = usuario_id);

-- Function to create profile automatically on user signup
CREATE OR REPLACE FUNCTION public.handle_new_scribia_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.scribia_usuarios (id, nome_completo, email, cpf, whatsapp)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', '')
  );
  
  -- Create free subscription by default
  INSERT INTO public.scribia_assinaturas (usuario_id, plano, status)
  VALUES (NEW.id, 'free', 'ativo');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-create profile on auth.users insert
CREATE TRIGGER on_auth_user_created_scribia
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_scribia_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_scribia_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on scribia_usuarios
CREATE TRIGGER update_scribia_usuarios_updated_at
  BEFORE UPDATE ON public.scribia_usuarios
  FOR EACH ROW EXECUTE FUNCTION public.update_scribia_updated_at();