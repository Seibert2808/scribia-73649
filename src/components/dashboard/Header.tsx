import React from 'react';
import { Brain, MessageCircle, Settings, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomAuth } from '@/hooks/useCustomAuth';

interface HeaderProps {
  onOpenLia: () => void;
  onOpenTutor: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLia, onOpenTutor }) => {
  const { user, logout } = useCustomAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-64 right-0 z-20 flex items-center justify-between px-6">
      {/* Saudação */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Olá, {user?.profile?.nome_completo || 'Usuário'} 👋
          </h2>
          <p className="text-sm text-gray-600">
            Bem-vindo ao seu painel ScribIA Plus
          </p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="flex items-center space-x-3">
        {/* Notificações */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
        </Button>

        {/* Bia - Análise de Perfil */}
        <Button
          onClick={onOpenLia}
          variant="outline"
          size="sm"
          className="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Brain className="w-4 h-4 mr-2" />
          Bia
        </Button>

        {/* Tutor ScribIA */}
        <Button
          onClick={onOpenTutor}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Tutor
        </Button>

        {/* Configurações */}
        <Button variant="ghost" size="sm">
          <Settings className="w-5 h-5 text-gray-600" />
        </Button>

        {/* Logout */}
        <Button
          onClick={logout}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;