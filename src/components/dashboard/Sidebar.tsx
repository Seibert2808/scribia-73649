import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  User, 
  Brain, 
  MessageCircle, 
  HelpCircle, 
  LogOut,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomAuth } from '@/hooks/useCustomAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useCustomAuth();

  const menuItems = [
    { icon: Home, label: 'Início', path: '/dashboard' },
    { icon: Calendar, label: 'Meus Eventos', path: '/dashboard/eventos' },
    { icon: BookOpen, label: 'Meus Livebooks', path: '/dashboard/livebooks' },
    { icon: User, label: 'Meu Perfil', path: '/dashboard/perfil' },
    { icon: Brain, label: 'Bia (Análise de Perfil)', path: '/dashboard/lia' },
    { icon: MessageCircle, label: 'Tutor ScribIA', path: '/dashboard/tutor' },
    { icon: HelpCircle, label: 'Ajuda / Suporte', path: '/dashboard/ajuda' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-30 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ScribIA</h1>
            <p className="text-sm text-purple-600 font-medium">Plus</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          to="/dashboard/configuracoes"
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Configurações</span>
        </Link>
        
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;