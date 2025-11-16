import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCustomAuth } from "@/hooks/useCustomAuth";
import { Building2, DollarSign, Mic2, Ticket, User } from "lucide-react";
import { Helmet } from "react-helmet-async";

type ProfileType = 'organizador_evento' | 'patrocinador_evento' | 'palestrante_influencer' | 'participante_evento' | 'usuario_individual';

interface ProfileOption {
  type: ProfileType;
  icon: React.ReactNode;
  title: string;
  description: string;
  requiresEvent: boolean;
  eventPlaceholder?: string;
}

const profileOptions: ProfileOption[] = [
  {
    type: 'organizador_evento',
    icon: <Building2 className="h-12 w-12" />,
    title: 'Organizador de Evento',
    description: 'Gerencio eventos, palestras e relatórios executivos',
    requiresEvent: false,
  },
  {
    type: 'patrocinador_evento',
    icon: <DollarSign className="h-12 w-12" />,
    title: 'Patrocinador',
    description: 'Acompanho métricas de ROI e visibilidade de marca',
    requiresEvent: true,
    eventPlaceholder: 'Qual evento você está patrocinando?',
  },
  {
    type: 'palestrante_influencer',
    icon: <Mic2 className="h-12 w-12" />,
    title: 'Palestrante/Influencer',
    description: 'Gerencio palestras e analytics de audiência',
    requiresEvent: true,
    eventPlaceholder: 'Em qual evento você vai palestrar?',
  },
  {
    type: 'participante_evento',
    icon: <Ticket className="h-12 w-12" />,
    title: 'Participante de Evento',
    description: 'Acesso livebooks de eventos inscritos',
    requiresEvent: true,
    eventPlaceholder: 'Qual evento você vai participar?',
  },
  {
    type: 'usuario_individual',
    icon: <User className="h-12 w-12" />,
    title: 'Usuário Individual',
    description: 'Crio livebooks próprios de áudios',
    requiresEvent: false,
  },
];

const SelecionarTipoConta = () => {
  const [selectedProfile, setSelectedProfile] = useState<ProfileType | null>(null);
  const [eventoAssociado, setEventoAssociado] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUserRoleAndEvent } = useCustomAuth();

  const selectedOption = profileOptions.find(opt => opt.type === selectedProfile);

  const handleConfirm = async () => {
    if (!selectedProfile) {
      toast.error("Por favor, selecione um tipo de perfil");
      return;
    }

    if (!user?.profile?.id) {
      toast.error("Erro: usuário não identificado");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const result = await setUserRoleAndEvent(
        selectedProfile,
        eventoAssociado || null
      );

      if (result.success) {
        toast.success("Perfil configurado com sucesso!");
        
        // Redirecionar baseado no tipo de perfil
        switch (selectedProfile) {
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
            navigate('/definir-perfil');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        toast.error(result.error || "Erro ao configurar perfil");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error("Erro ao configurar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Selecionar Perfil - ScribIA</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Qual é o seu perfil no ScribIA?
            </h1>
            <p className="text-muted-foreground">
              Selecione o tipo de conta que melhor se adequa ao seu uso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {profileOptions.map((option) => (
              <Card
                key={option.type}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedProfile === option.type
                    ? 'border-primary border-2 bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => setSelectedProfile(option.type)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`${selectedProfile === option.type ? 'text-primary' : 'text-muted-foreground'}`}>
                    {option.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {selectedOption?.requiresEvent && (
            <div className="mb-6 space-y-2 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="evento">
                Nome do Evento (opcional)
              </Label>
              <Input
                id="evento"
                placeholder={selectedOption.eventPlaceholder}
                value={eventoAssociado}
                onChange={(e) => setEventoAssociado(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                Você poderá editar esta informação posteriormente nas configurações
              </p>
            </div>
          )}

          <Button
            onClick={handleConfirm}
            disabled={!selectedProfile || loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Salvando..." : "Confirmar e Continuar"}
          </Button>
        </Card>
      </div>
    </>
  );
};

export default SelecionarTipoConta;
