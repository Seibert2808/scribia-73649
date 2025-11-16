import React from 'react';
import { Plus, FileBarChart, Brain, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCustomAuth } from '@/hooks/useCustomAuth';

interface OrganizadorHeaderProps {
  onOpenTutor: () => void;
  isMobile?: boolean;
}

const OrganizadorHeader = ({ onOpenTutor, isMobile = false }: OrganizadorHeaderProps) => {
  const { user } = useCustomAuth();

  return (
    <header className={`fixed top-0 right-0 ${isMobile ? 'left-0' : 'left-64'} h-16 bg-card border-b shadow-sm z-30`}>
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left side - Greeting */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <div className="min-w-0">
            <h2 className="text-base md:text-lg font-semibold truncate">
              Olá, Organizador 👋
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
              Bem-vindo ao painel do organizador ScribIA Plus
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search */}
          {!isMobile && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos, palestras..."
                className="pl-10 w-64"
              />
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {!isMobile && (
              <>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
                
                <Button variant="outline" size="sm">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenTutor}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <Brain className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Tutor ScribIA</span>
            </Button>
          </div>

          {/* Notifications */}
          {!isMobile && (
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  3
                </Badge>
              </Button>
            </div>
          )}

          {/* User Avatar */}
          <div className="flex items-center gap-2 ml-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                O
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrganizadorHeader;