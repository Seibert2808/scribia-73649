import React from 'react';
import { Settings, LogOut, Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HeaderProps {
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isMobile = false }) => {
  const { user, logout } = useCustomAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <header className={`bg-card border-b border-border h-14 md:h-16 fixed top-0 ${isMobile ? 'left-0' : 'left-64'} right-0 z-20 flex items-center justify-between ${isMobile ? 'pl-14 pr-3' : 'px-6'}`}>
      {/* Saudação */}
      <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
        <div className="min-w-0 w-full">
          <h2 className="text-xs md:text-lg font-semibold text-foreground truncate">
            Olá, {user?.profile?.nome_completo?.split(' ')[0] || 'Usuário'} 👋
          </h2>
          <p className="text-xs text-muted-foreground hidden lg:block truncate">
            Bem-vindo ao seu painel ScribIA Plus
          </p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-3">
        {/* Notificações */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9">
              <Bell className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] md:w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm md:text-base">Notificações</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                    </Badge>
                  )}
                  {notifications.some(n => !n.lida) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-7 text-xs"
                    >
                      <CheckCheck className="w-3 h-3 mr-1" />
                      Marcar todas
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-3 max-h-[60vh] md:max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notif.lida ? 'hover:bg-muted' : 'bg-muted/50 hover:bg-muted'
                      }`}
                      onMouseEnter={() => !notif.lida && markAsRead(notif.id)}
                      onClick={() => {
                        if (notif.link) {
                          navigate(notif.link);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${!notif.lida ? 'text-primary' : ''}`}>
                          {notif.titulo}
                        </p>
                        {!notif.lida && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notif.mensagem}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notif.criado_em), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Configurações */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard/configuracoes')}
          className="h-8 w-8 md:h-9 md:w-9"
        >
          <Settings className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
        </Button>

        {/* Logout - Hidden on mobile */}
        {!isMobile && (
          <Button
            onClick={logout}
            variant="ghost"
            size="icon"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-9"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;