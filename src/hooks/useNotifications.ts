import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth } from './useCustomAuth';

export interface Notification {
  id: string;
  tipo: 'livebook' | 'evento' | 'palestra' | 'sistema';
  titulo: string;
  mensagem: string;
  link?: string;
  lida: boolean;
  criado_em: string;
  lida_em?: string;
}

export const useNotifications = () => {
  const { user } = useCustomAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Buscar notificações iniciais
  useEffect(() => {
    if (!user?.profile?.id) {
      setLoading(false);
      return;
    }

    fetchNotifications();
  }, [user?.profile?.id]);

  // Configurar realtime
  useEffect(() => {
    if (!user?.profile?.id) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scribia_notificacoes',
          filter: `usuario_id=eq.${user.profile.id}`,
        },
        (payload) => {
          console.log('🔔 Notificação atualizada:', payload);
          fetchNotifications(); // Recarregar notificações quando houver mudanças
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.profile?.id]);

  const fetchNotifications = async () => {
    if (!user?.profile?.id) return;

    try {
      const { data, error } = await supabase.rpc('scribia_get_notifications', {
        p_usuario_id: user.profile.id,
        p_limit: 10
      });

      if (error) throw error;

      const result = data as any;
      
      if (result.success) {
        setNotifications(result.notifications || []);
        setUnreadCount(result.unread_count || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.profile?.id) return;

    try {
      const { data, error } = await supabase.rpc('scribia_mark_notification_read', {
        p_notificacao_id: notificationId,
        p_usuario_id: user.profile.id
      });

      if (error) throw error;

      // Atualizar localmente
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, lida: true, lida_em: new Date().toISOString() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.profile?.id) return;

    try {
      const { error } = await supabase.rpc('scribia_mark_all_notifications_read', {
        p_usuario_id: user.profile.id
      });

      if (error) throw error;

      // Atualizar localmente
      setNotifications(prev =>
        prev.map(n => ({ ...n, lida: true, lida_em: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  };
};