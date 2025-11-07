import { useState, useEffect } from "react";
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
}

interface UserSubscription {
  id: string;
  plano: string;
  status: string;
  renovacao_em: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          setUser({ id: (data as any).user.id });
          setProfile((data as any).user);
          setSubscription((data as any).subscription);
        } else {
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

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('scribia_get_user' as any, {
        p_user_id: userId
      });

      if (!error && (data as any)?.success) {
        setProfile((data as any).user);
        setSubscription((data as any).subscription);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  return {
    user,
    profile,
    subscription,
    loading,
    isAuthenticated: !!user,
    fetchUserData,
  };
}
