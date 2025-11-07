import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import LiaModal from './LiaModal';
import TutorChat from './TutorChat';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import DashboardHome from '@/pages/dashboard/Dashboard';
import Profile from '@/pages/dashboard/Profile';
import EventosDashboard from '@/pages/dashboard/EventosDashboard';
import Livebooks from '@/pages/dashboard/Livebooks';

const DashboardLayout = () => {
  const [isLiaOpen, setIsLiaOpen] = useState(false);
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
      <Sidebar />
      
      <Header 
        onOpenLia={() => setIsLiaOpen(true)}
        onOpenTutor={() => setIsTutorOpen(true)}
      />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="eventos" element={<EventosDashboard />} />
            <Route path="livebooks" element={<Livebooks />} />
          </Routes>
        </div>
      </main>

      <LiaModal 
        isOpen={isLiaOpen} 
        onClose={() => setIsLiaOpen(false)} 
      />
      
      <TutorChat 
        isOpen={isTutorOpen} 
        onClose={() => setIsTutorOpen(false)} 
      />
    </div>
  );
};

export default DashboardLayout;