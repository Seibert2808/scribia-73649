import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomAuth } from "@/hooks/useCustomAuth";

interface RoleBasedRouteProps {
  children: React.ReactNode;
}

export function RoleBasedRoute({ children }: RoleBasedRouteProps) {
  const { user, loading, userType } = useCustomAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    // Se usuário não tem tipo definido, redireciona para seleção
    if (!userType) {
      navigate("/selecionar-tipo-conta");
      return;
    }

    // Redirecionar para dashboard correto baseado no tipo
    const currentPath = window.location.pathname;
    
    // Evitar loop de redirecionamento se já estiver na página correta
    const expectedPaths: Record<string, string[]> = {
      'organizador_evento': ['/organizador'],
      'patrocinador_evento': ['/dashboard/patrocinador'],
      'palestrante_influencer': ['/dashboard/palestrante'],
      'participante_evento': ['/dashboard', '/definir-perfil'],
      'usuario_individual': ['/dashboard', '/definir-perfil'],
      'admin': ['/admin'],
    };

    const allowedPaths = expectedPaths[userType] || [];
    const isOnAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));

    if (!isOnAllowedPath) {
      // Redirecionar para dashboard apropriado
      switch (userType) {
        case 'organizador_evento':
          navigate('/organizador/dashboard');
          break;
        case 'patrocinador_evento':
          navigate('/dashboard/patrocinador');
          break;
        case 'palestrante_influencer':
          navigate('/dashboard/palestrante');
          break;
        case 'participante_evento':
        case 'usuario_individual':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/selecionar-tipo-conta');
      }
    }
  }, [user, loading, userType, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
