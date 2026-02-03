// Mock Authentication System
export const MOCK_PROFILES = {
  'organizador_evento': {
    id: 'mock-org-001',
    email: 'organizador_evento@mock.com',
    role: 'organizador_evento',
    dashboard: '/organizador/dashboard',
    profile: {
      id: 'mock-org-001',
      nome_completo: 'Organizador Mock',
      email: 'organizador_evento@mock.com',
      cpf: '000.000.000-00',
      whatsapp: '+55 11 99999-0001',
      tipo_conta: 'organizador_evento',
      perfil_definido: true,
    }
  },
  'patrocinador_evento': {
    id: 'mock-pat-002',
    email: 'patrocinador_evento@mock.com',
    role: 'patrocinador_evento',
    dashboard: '/dashboard/patrocinador',
    profile: {
      id: 'mock-pat-002',
      nome_completo: 'Patrocinador Mock',
      email: 'patrocinador_evento@mock.com',
      cpf: '000.000.000-00',
      whatsapp: '+55 11 99999-0002',
      tipo_conta: 'patrocinador_evento',
      perfil_definido: true,
      evento_associado: 'Evento Mock 2024',
    }
  },
  'palestrante_influencer': {
    id: 'mock-pal-003',
    email: 'palestrante_influencer@mock.com',
    role: 'palestrante_influencer',
    dashboard: '/dashboard/palestrante',
    profile: {
      id: 'mock-pal-003',
      nome_completo: 'Palestrante Mock',
      email: 'palestrante_influencer@mock.com',
      cpf: '000.000.000-00',
      whatsapp: '+55 11 99999-0003',
      tipo_conta: 'palestrante_influencer',
      perfil_definido: true,
      evento_associado: 'Evento Mock 2024',
    }
  },
  'participante_evento': {
    id: 'mock-par-004',
    email: 'participante_evento@mock.com',
    role: 'participante_evento',
    dashboard: '/dashboard',
    profile: {
      id: 'mock-par-004',
      nome_completo: 'Participante Mock',
      email: 'participante_evento@mock.com',
      cpf: '000.000.000-00',
      whatsapp: '+55 11 99999-0004',
      tipo_conta: 'participante_evento',
      perfil_definido: true,
      evento_associado: 'Evento Mock 2024',
    }
  },
  'usuario_individual': {
    id: 'mock-usr-005',
    email: 'usuario_individual@mock.com',
    role: 'usuario_individual',
    dashboard: '/dashboard',
    profile: {
      id: 'mock-usr-005',
      nome_completo: 'Usuário Individual Mock',
      email: 'usuario_individual@mock.com',
      cpf: '000.000.000-00',
      whatsapp: '+55 11 99999-0005',
      tipo_conta: 'usuario_individual',
      perfil_definido: true,
    }
  },
};

export type MockProfileType = keyof typeof MOCK_PROFILES;

export const isMockProfile = (email: string): boolean => {
  return email in MOCK_PROFILES;
};

export const getMockProfile = (email: string) => {
  return MOCK_PROFILES[email as MockProfileType] || null;
};

export const mockLogin = (email: string, password: string) => {
  const profile = getMockProfile(email);
  
  if (profile) {
    // Store mock session
    localStorage.setItem('mock_session', JSON.stringify({
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
      },
      profile: profile.profile,
      access_token: 'mock-token-' + profile.id,
      expires_at: Date.now() + 3600000, // 1 hour
    }));
    
    return {
      success: true,
      user: profile,
      dashboard: profile.dashboard,
    };
  }
  
  return {
    success: false,
    error: 'Credenciais inválidas',
  };
};

export const getMockSession = () => {
  const session = localStorage.getItem('mock_session');
  if (session) {
    const parsed = JSON.parse(session);
    if (parsed.expires_at > Date.now()) {
      return parsed;
    }
    localStorage.removeItem('mock_session');
  }
  return null;
};

export const mockLogout = () => {
  localStorage.removeItem('mock_session');
};

// Mock data for events
export const MOCK_EVENTS = [
  {
    id: 'evt-001',
    nome: 'Congresso de Tecnologia 2024',
    descricao: 'Maior evento de tecnologia do Brasil',
    data_inicio: '2024-03-15',
    data_fim: '2024-03-17',
    local: 'São Paulo Convention Center',
    organizador_id: 'mock-org-001',
    status: 'ativo',
    total_participantes: 1500,
    total_palestras: 45,
  },
  {
    id: 'evt-002',
    nome: 'Summit de Inovação',
    descricao: 'Inovação e transformação digital',
    data_inicio: '2024-04-20',
    data_fim: '2024-04-21',
    local: 'Rio de Janeiro',
    organizador_id: 'mock-org-001',
    status: 'planejamento',
    total_participantes: 800,
    total_palestras: 30,
  },
];

// Mock data for palestras
export const MOCK_PALESTRAS = [
  {
    id: 'pal-001',
    titulo: 'O Futuro da IA',
    descricao: 'Como a inteligência artificial está transformando o mundo',
    evento_id: 'evt-001',
    palestrante_nome: 'Dr. João Silva',
    data_hora: '2024-03-15T10:00:00',
    duracao_minutos: 60,
    status: 'confirmada',
    audio_url: null,
    transcricao: null,
  },
  {
    id: 'pal-002',
    titulo: 'Blockchain e Web3',
    descricao: 'A nova era da internet descentralizada',
    evento_id: 'evt-001',
    palestrante_nome: 'Maria Santos',
    data_hora: '2024-03-15T14:00:00',
    duracao_minutos: 45,
    status: 'confirmada',
    audio_url: null,
    transcricao: null,
  },
];

// Mock data for livebooks
export const MOCK_LIVEBOOKS = [
  {
    id: 'lvb-001',
    titulo: 'Livebook - O Futuro da IA',
    palestra_id: 'pal-001',
    evento_id: 'evt-001',
    status: 'concluido',
    conteudo: 'Conteúdo do livebook gerado pela IA...',
    created_at: '2024-03-15T12:00:00',
    progresso: 100,
  },
];
