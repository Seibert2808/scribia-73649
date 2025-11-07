import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  nome_completo: string;
  cpf: string | null;
  email: string;
  whatsapp: string | null;
  email_verificado: boolean;
  ultimo_login: string | null;
  criado_em: string;
  roles?: string[];
}

interface UserSubscription {
  id: string;
  plano: string;
  status: string;
  renovacao_em: string | null;
}

interface AuthUser {
  profile: UserProfile;
  subscription: UserSubscription;
}

interface SignupData {
  nome_completo: string;
  email: string;
  senha: string;
  cpf?: string;
  whatsapp?: string;
}

export function useCustomAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUserId = localStorage.getItem('scribia_user_id');
      if (storedUserId) {
        const { data, error } = await supabase.rpc('scribia_get_user' as any, {
          p_user_id: storedUserId
        });

        if (!error && (data as any)?.success) {
          setUser({
            profile: (data as any).user,
            subscription: (data as any).subscription
          });
        } else {
          // Limpar dados inválidos
          localStorage.removeItem('scribia_user_id');
        }
      }
    } catch (error) {
      console.error("Erro ao verificar usuário armazenado:", error);
      localStorage.removeItem('scribia_user_id');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await supabase.rpc('scribia_login' as any, {
        p_email: email,
        p_senha: password
      }) as any;

      if (data?.success) {
        const userData = {
          profile: data.user,
          subscription: data.subscription
        };
        
        localStorage.setItem('scribia_user', JSON.stringify(userData));
        localStorage.setItem('scribia_user_id', data.user.id);
        setUser(userData);
        
        return { success: true, user: userData.profile, subscription: userData.subscription };
      } else {
        return { success: false, error: data?.error || 'Erro no login' };
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      const { data, error } = await supabase.rpc('scribia_signup' as any, {
        p_nome_completo: signupData.nome_completo,
        p_email: signupData.email,
        p_senha: signupData.senha,
        p_cpf: signupData.cpf || null,
        p_whatsapp: signupData.whatsapp || null
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!(data as any).success) {
        return { success: false, error: (data as any).error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('scribia_user_id');
    setUser(null);
    navigate('/login');
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('scribia_request_password_reset' as any, {
        p_email: email
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: (data as any).success, error: (data as any).error };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const { data, error } = await supabase.rpc('scribia_reset_password' as any, {
        p_token: token,
        p_nova_senha: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: (data as any).success, error: (data as any).error };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      const { data, error } = await supabase.rpc('scribia_verify_email' as any, {
        p_token: token
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: (data as any).success, error: (data as any).error };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const checkIsAdmin = async (userId?: string) => {
    try {
      const userIdToCheck = userId || user?.profile.id;
      if (!userIdToCheck) return false;

      const { data, error } = await supabase.rpc('scribia_is_admin' as any, {
        p_user_id: userIdToCheck
      });

      if (error) {
        console.error('Erro ao verificar admin:', error);
        return false;
      }

      return data as boolean;
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      return false;
    }
  };

  const assignAdminRole = async (email: string) => {
    try {
      const { data, error } = await supabase.rpc('scribia_assign_admin_role' as any, {
        p_user_email: email
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: (data as any).success, error: (data as any).error };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    checkIsAdmin,
    assignAdminRole,
  };
}

// Compatibilidade com o hook antigo
export function useAuth() {
  const auth = useCustomAuth();
  
  return {
    user: auth.user ? { id: auth.user.profile.id } : null,
    profile: auth.user?.profile || null,
    subscription: auth.user?.subscription || null,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
    checkIsAdmin: auth.checkIsAdmin,
    assignAdminRole: auth.assignAdminRole,
  };
}