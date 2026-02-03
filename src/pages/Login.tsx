import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { isMockProfile, mockLogin } from "@/lib/mockAuth";
import { Building2, DollarSign, Mic2, Ticket, User } from "lucide-react";

const PROFILE_BUTTONS = [
  {
    type: 'organizador_evento',
    icon: Building2,
    title: 'Organizador',
    description: 'Gerenciar eventos e palestras',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    type: 'patrocinador_evento',
    icon: DollarSign,
    title: 'Patrocinador',
    description: 'Métricas de ROI',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    type: 'palestrante_influencer',
    icon: Mic2,
    title: 'Palestrante',
    description: 'Minhas palestras',
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    type: 'participante_evento',
    icon: Ticket,
    title: 'Participante',
    description: 'Acessar livebooks',
    color: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    type: 'usuario_individual',
    icon: User,
    title: 'Usuário Individual',
    description: 'Criar livebooks',
    color: 'bg-gray-500 hover:bg-gray-600',
  },
];

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProfileLogin = async (profileType: string) => {
    setLoading(true);
    
    try {
      const mockResult = mockLogin(profileType, 'any');
      
      if (mockResult.success) {
        toast.success(`Acesso como ${profileType.replace(/_/g, ' ')} realizado!`);
        navigate(mockResult.dashboard);
      } else {
        toast.error('Erro ao fazer login');
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Acessar ScribIA
          </CardTitle>
          <CardDescription className="text-center">
            Selecione seu perfil para acessar o sistema
          </CardDescription>
          <div className="text-center">
            <Link to="/" className="text-sm text-primary hover:underline">
              Voltar para Home
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROFILE_BUTTONS.map((profile) => {
              const Icon = profile.icon;
              return (
                <Button
                  key={profile.type}
                  onClick={() => handleProfileLogin(profile.type)}
                  disabled={loading}
                  className={`h-auto flex flex-col items-center gap-3 p-6 ${profile.color} text-white`}
                  variant="default"
                >
                  <Icon className="h-12 w-12" />
                  <div className="text-center">
                    <div className="font-semibold text-lg">{profile.title}</div>
                    <div className="text-xs opacity-90">{profile.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link to="/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
