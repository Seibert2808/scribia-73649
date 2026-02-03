import { useState, useEffect } from 'react';
import { notificacoesApi } from '@/services/api';
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

  // Polling para atualizar notificações a cada 30 segundos
  useEffect(() => {
    if (!user?.profile?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [user?.profile?.id]);

  const fetchNotifications = async () => {
    if (!user?.profile?.id) return;

    try {
      const response = await notificacoesApi.list(10);
      const data = response.data;
      
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.profile?.id) return;

    try {
      await notificacoesApi.markAsRead(notificationId);

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
      await notificacoesApi.markAllAsRead();

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