import { useState, useEffect } from 'react';
import { dashboardApi, eventosApi, livebooksApi } from '@/services/api';
import { useCustomAuth } from './useCustomAuth';

export function useDashboard() {
  const { user } = useCustomAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    if (user?.profile?.id) {
      fetchDashboard();
    }
  }, [user]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const perfil = user?.profile?.roles?.[0];
      const response = await dashboardApi.getInicio(perfil);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    dashboardData,
    refetch: fetchDashboard,
  };
}

export function useEventos() {
  const [loading, setLoading] = useState(false);
  const [eventos, setEventos] = useState<any[]>([]);

  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await eventosApi.list();
      setEventos(response.data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvento = async (data: any) => {
    try {
      const response = await eventosApi.create(data);
      await fetchEventos();
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar evento' };
    }
  };

  const updateEvento = async (id: string, data: any) => {
    try {
      const response = await eventosApi.update(id, data);
      await fetchEventos();
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar evento' };
    }
  };

  const deleteEvento = async (id: string) => {
    try {
      await eventosApi.delete(id);
      await fetchEventos();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Erro ao deletar evento' };
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  return {
    loading,
    eventos,
    createEvento,
    updateEvento,
    deleteEvento,
    refetch: fetchEventos,
  };
}

export function useLivebooks() {
  const [loading, setLoading] = useState(false);
  const [livebooks, setLivebooks] = useState<any[]>([]);

  const fetchLivebooks = async () => {
    try {
      setLoading(true);
      const response = await livebooksApi.list();
      setLivebooks(response.data);
    } catch (error) {
      console.error('Erro ao carregar livebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLivebook = async (data: any) => {
    try {
      const response = await livebooksApi.create(data);
      await fetchLivebooks();
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Erro ao criar livebook' };
    }
  };

  useEffect(() => {
    fetchLivebooks();
  }, []);

  return {
    loading,
    livebooks,
    createLivebook,
    refetch: fetchLivebooks,
  };
}
