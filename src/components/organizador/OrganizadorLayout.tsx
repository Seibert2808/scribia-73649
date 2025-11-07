import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import OrganizadorSidebar from './OrganizadorSidebar';
import OrganizadorHeader from './OrganizadorHeader';
import TutorOrganizadorModal from './TutorOrganizadorModal';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import OrganizadorDashboard from '@/pages/organizador/OrganizadorDashboard';

// Importar páginas do organizador
import MeusEventos from '@/pages/organizador/MeusEventos';
import Participantes from '@/pages/organizador/Participantes';
import PalestrasLivebooks from '@/pages/organizador/PalestrasLivebooks';
import RankingsTendencias from '@/pages/organizador/RankingsTendencias';
import RelatoriosExecutivos from '@/pages/organizador/RelatoriosExecutivos';
import ConfiguracoesOrganizador from '@/pages/organizador/ConfiguracoesOrganizador';

const OrganizadorLayout = () => {
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const { loading } = useCustomAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OrganizadorSidebar />
      
      <OrganizadorHeader 
        onOpenTutor={() => setIsTutorOpen(true)}
      />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6">
          <Routes>
            <Route index element={<OrganizadorDashboard />} />
            <Route path="eventos" element={<MeusEventos />} />
            <Route path="participantes" element={<Participantes />} />
            <Route path="palestras-livebooks" element={<PalestrasLivebooks />} />
            <Route path="rankings" element={<RankingsTendencias />} />
            <Route path="relatorios" element={<RelatoriosExecutivos />} />
            <Route path="configuracoes" element={<ConfiguracoesOrganizador />} />
          </Routes>
        </div>
      </main>

      <TutorOrganizadorModal 
        isOpen={isTutorOpen} 
        onClose={() => setIsTutorOpen(false)} 
      />
    </div>
  );
};

export default OrganizadorLayout;