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
  nivel_preferido?: string | null;
  formato_preferido?: string | null;
  perfil_definido?: boolean;
  perfil_definido_em?: string | null;
  evento_associado?: string | null;
}

type UserType = 'organizador_evento' | 'patrocinador_evento' | 'palestrante_influencer' | 
                'participante_evento' | 'usuario_individual' | 'admin';

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
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUserId = localStorage.getItem('scribia_user_id');
      const storedUser = localStorage.getItem('scribia_user');
      
      if (storedUserId && storedUser) {
        // Primeiro, usar dados do cache para resposta rápida
        try {
          const cachedData = JSON.parse(storedUser);
          setUser(cachedData);
        } catch (e) {
          console.error("Erro ao parsear usuário do cache:", e);
        }

        // Depois, validar com o servidor
        const { data, error } = await supabase.rpc('scribia_get_user' as any, {
          p_user_id: storedUserId
        });

        if (!error && (data as any)?.success) {
          const userData = {
            profile: (data as any).user,
            subscription: (data as any).subscription
          };
          setUser(userData);
          localStorage.setItem('scribia_user', JSON.stringify(userData));
          
          // Determinar tipo de usuário
          if ((data as any).user.roles && (data as any).user.roles.length > 0) {
            const role = (data as any).user.roles[0] as UserType;
            setUserType(role);
          }
        } else {
          console.error("Erro ao validar usuário:", error);
          // Não limpar localStorage imediatamente, apenas em caso de erro de autenticação
          if (error?.message?.includes('authentication')) {
            localStorage.removeItem('scribia_user_id');
            localStorage.removeItem('scribia_user');
            setUser(null);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar usuário armazenado:", error);
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
        // Verificar se o email foi verificado
        if (!data.user.email_verificado) {
          return { 
            success: false, 
            error: 'Por favor, verifique seu email antes de fazer login. Cheque sua caixa de entrada e spam.',
            requiresVerification: true
          };
        }

        const userData = {
          profile: data.user,
          subscription: data.subscription
        };
        
        localStorage.setItem('scribia_user', JSON.stringify(userData));
        localStorage.setItem('scribia_user_id', data.user.id);
        setUser(userData);
        
        // Determinar tipo de usuário
        if (data.user.roles && data.user.roles.length > 0) {
          const role = data.user.roles[0] as UserType;
          setUserType(role);
        }
        
        // Verificar se o perfil foi definido
        const needsProfile = !data.user.perfil_definido;
        
        return { 
          success: true, 
          user: userData.profile, 
          subscription: userData.subscription,
          needsProfile 
        };
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

      // Enviar email de verificação via edge function
      try {
        console.log('📧 Iniciando envio de email de verificação...');
        const emailResult = await supabase.functions.invoke('scribia-send-verification-email', {
          body: {
            email: signupData.email,
            nome: signupData.nome_completo,
            token: (data as any).verification_token,
            app_url: window.location.origin // URL correto da aplicação
          }
        });

        console.log('✅ Resultado do envio de email:', emailResult);
        
        if (emailResult.error) {
          console.error('❌ Erro no retorno da função:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Erro ao enviar email de verificação:', emailError);
        // Não bloqueamos o cadastro se o email falhar
      }

      return { 
        success: true,
        message: 'Cadastro realizado! Verifique seu email para ativar sua conta.',
        requiresVerification: true
      };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('scribia_user_id');
    localStorage.removeItem('scribia_user');
    setUser(null);
    setUserType(null);
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

  const updateProfile = async (nivel: string, formato: string) => {
    try {
      if (!user?.profile.id) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase.rpc('scribia_update_profile' as any, {
        p_user_id: user.profile.id,
        p_nivel: nivel,
        p_formato: formato
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Atualizar dados locais do banco e aguardar para garantir que o estado seja atualizado
      await checkStoredUser();
      
      // Pequeno delay para garantir que o React atualizou o estado
      await new Promise(resolve => setTimeout(resolve, 100));

      return { success: true, data: data as any };
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  // Nova função para salvar role e evento
  const setUserRoleAndEvent = async (role: UserType, eventoAssociado: string | null) => {
    if (!user?.profile.id) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const { data, error } = await supabase.rpc('scribia_set_user_role_and_event', {
        p_user_id: user.profile.id,
        p_role: role,
        p_evento_associado: eventoAssociado,
      });

      if (error) throw error;

      if ((data as any).success) {
        setUserType(role);
        // Atualizar evento no user state
        setUser(prev => prev ? {
          ...prev,
          profile: { ...prev.profile, evento_associado: eventoAssociado }
        } : null);
      }

      return data as any;
    } catch (error: any) {
      console.error("Erro ao salvar role e evento:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    userType,
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
    updateProfile,
    setUserRoleAndEvent,
  };
}

// Compatibilidade com o hook antigo
export function useAuth() {
  const auth = useCustomAuth();
  
  return {
    user: auth.user ? { id: auth.user.profile.id } : null,
    profile: auth.user?.profile || null,
    subscription: auth.user?.subscription || null,
    userType: auth.userType,
    loading: auth.loading,
    isAuthenticated: auth.isAuthenticated,
    checkIsAdmin: auth.checkIsAdmin,
    assignAdminRole: auth.assignAdminRole,
  };
}