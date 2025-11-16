import { useState } from "react";
import { Calendar, Users, Handshake } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const FinalCTA = () => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nomeEvento: "",
    cidade: "",
    estado: "",
    totalParticipantes: "",
    email: "",
    telefone: ""
  });
  const [sponsorFormData, setSponsorFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("scribia_contato_organizador")
        .insert({
          nome_evento: formData.nomeEvento,
          cidade: formData.cidade,
          estado: formData.estado,
          total_participantes: parseInt(formData.totalParticipantes),
          email: formData.email,
          telefone: formData.telefone
        });

      if (error) throw error;

      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato em breve com seu orçamento.",
      });

      setIsEventDialogOpen(false);
      setFormData({
        nomeEvento: "",
        cidade: "",
        estado: "",
        totalParticipantes: "",
        email: "",
        telefone: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('scribia-send-contact', {
        body: {
          name: sponsorFormData.name,
          email: sponsorFormData.email,
          message: sponsorFormData.message,
          type: "sponsor"
        }
      });

      if (error) throw error;

      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato para discutir oportunidades de patrocínio.",
      });

      setIsSponsorDialogOpen(false);
      setSponsorFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending sponsor message:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#928bdd] to-[#7d75c9] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Pronto para Transformar Seus Eventos?
        </h2>
        <p className="text-lg mb-10 opacity-95 max-w-2xl mx-auto">
          Escolha como você quer revolucionar a experiência de eventos com IA
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <button 
            onClick={() => setIsEventDialogOpen(true)}
            className="group bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:border-white/40 p-8 rounded-3xl transition-all hover:-translate-y-2 cursor-pointer"
          >
            <Calendar className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Organizo Eventos</h3>
            <p className="text-sm opacity-90">Agende uma demonstração personalizada</p>
          </button>
          
          <a 
            href="/participantes" 
            className="group bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:border-white/40 p-8 rounded-3xl transition-all hover:-translate-y-2 cursor-pointer"
          >
            <Users className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Participo de Eventos</h3>
            <p className="text-sm opacity-90">Experimente o ScribIA gratuitamente</p>
          </a>
          
          <button 
            onClick={() => setIsSponsorDialogOpen(true)}
            className="group bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 hover:border-white/40 p-8 rounded-3xl transition-all hover:-translate-y-2 cursor-pointer w-full"
          >
            <Handshake className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Patrocino Eventos</h3>
            <p className="text-sm opacity-90">Descubra oportunidades de parceria</p>
          </button>
        </div>
      </div>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Demonstração Personalizada</DialogTitle>
            <DialogDescription>
              Preencha os dados do seu evento para recebermos um orçamento personalizado
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nomeEvento">Nome do Evento</Label>
              <Input
                id="nomeEvento"
                value={formData.nomeEvento}
                onChange={(e) => setFormData({ ...formData, nomeEvento: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="totalParticipantes">Total de Participantes</Label>
              <Input
                id="totalParticipantes"
                type="number"
                value={formData.totalParticipantes}
                onChange={(e) => setFormData({ ...formData, totalParticipantes: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Solicitar Orçamento"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSponsorDialogOpen} onOpenChange={setIsSponsorDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Oportunidades de Patrocínio</DialogTitle>
            <DialogDescription>
              Preencha o formulário e entraremos em contato para discutir como sua empresa pode patrocinar eventos com ScribIA
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSponsorSubmit} className="space-y-4">
            <div>
              <Label htmlFor="sponsorName">Nome / Empresa</Label>
              <Input
                id="sponsorName"
                value={sponsorFormData.name}
                onChange={(e) => setSponsorFormData({ ...sponsorFormData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sponsorEmail">E-mail</Label>
              <Input
                id="sponsorEmail"
                type="email"
                value={sponsorFormData.email}
                onChange={(e) => setSponsorFormData({ ...sponsorFormData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sponsorMessage">Mensagem</Label>
              <Input
                id="sponsorMessage"
                value={sponsorFormData.message}
                onChange={(e) => setSponsorFormData({ ...sponsorFormData, message: e.target.value })}
                placeholder="Conte-nos sobre seu interesse em patrocinar eventos"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FinalCTA;
