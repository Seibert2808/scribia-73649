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
    return MOCK_EVENTS;
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

  return {
    isMockMode,
    mockSession,
    getEventos,
    getPalestras,
    getLivebooks,
    getCurrentUser,
  };
};
