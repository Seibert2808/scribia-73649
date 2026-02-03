import { useState, useEffect } from 'react';
import { getMockSession, MOCK_EVENTS, MOCK_PALESTRAS, MOCK_LIVEBOOKS } from '@/lib/mockAuth';

export const useMockData = () => {
  const [mockSession, setMockSession] = useState<any>(null);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    const session = getMockSession();
    if (session) {
      setMockSession(session);
      setIsMockMode(true);
    }
  }, []);

  const getEventos = () => {
    if (!isMockMode) return [];
    return MOCK_EVENTS.map(evt => ({
      ...evt,
      nome: evt.nome,
      data_inicio: evt.data_inicio,
      data_fim: evt.data_fim,
      local: evt.local,
      organizador_id: evt.organizador_id,
      status: evt.status,
      total_participantes: evt.total_participantes,
      total_palestras: evt.total_palestras,
    }));
  };

  const getPalestras = (eventoId?: string) => {
    if (!isMockMode) return [];
    if (eventoId) {
      return MOCK_PALESTRAS.filter(p => p.evento_id === eventoId);
    }
    return MOCK_PALESTRAS;
  };

  const getLivebooks = (eventoId?: string) => {
    if (!isMockMode) return [];
    if (eventoId) {
      return MOCK_LIVEBOOKS.filter(l => l.evento_id === eventoId);
    }
    return MOCK_LIVEBOOKS;
  };

  const getCurrentUser = () => {
    if (!isMockMode || !mockSession) return null;
    return mockSession.profile;
  };

  const getParticipantes = () => {
    if (!isMockMode) return [];
    return [
      {
        id: 'part-001',
        nome: 'João Silva',
        email: 'joao@example.com',
        evento: 'Congresso de Tecnologia 2024',
        livebooks_gerados: 5,
        data_inscricao: '2024-01-15',
      },
      {
        id: 'part-002',
        nome: 'Maria Santos',
        email: 'maria@example.com',
        evento: 'Congresso de Tecnologia 2024',
        livebooks_gerados: 3,
        data_inscricao: '2024-01-20',
      },
      {
        id: 'part-003',
        nome: 'Pedro Costa',
        email: 'pedro@example.com',
        evento: 'Summit de Inovação',
        livebooks_gerados: 2,
        data_inscricao: '2024-02-10',
      },
    ];
  };

  return {
    isMockMode,
    mockSession,
    getEventos,
    getPalestras,
    getLivebooks,
    getCurrentUser,
    getParticipantes,
  };
};
