import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import LiaModal from './LiaModal';
import TutorChat from './TutorChat';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const [isLiaOpen, setIsLiaOpen] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <Header 
        onOpenLia={() => setIsLiaOpen(true)}
        onOpenTutor={() => setIsTutorOpen(true)}
      />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6">
          {children}
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

export default PageLayout;
