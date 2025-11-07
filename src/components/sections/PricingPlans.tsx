import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Link2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  nome_completo: string;
  email: string;
  whatsapp: string;
}

const PricingPlans = () => {
  const [formData, setFormData] = useState<FormData>({
    nome_completo: "",
    email: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const normalizeWhatsApp = (value: string) => value.replace(/\D/g, "");
  const validateWhatsApp = (digits: string) => digits.length >= 10 && digits.length <= 11;

  const formatWhatsApp = (value: string) => {
    const digits = normalizeWhatsApp(value);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setFormData({ ...formData, whatsapp: formatted });
  };

  const handleFreeSubmit = async () => {
    const { nome_completo, email, whatsapp } = formData;
    const whatsappDigits = normalizeWhatsApp(whatsapp);

    if (!nome_completo.trim() || !validateEmail(email) || !validateWhatsApp(whatsappDigits)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('scribia-free-signup', {
        body: {
          nome_completo: nome_completo.trim(),
          email: email.trim(),
          whatsapp: whatsappDigits,
        }
      });

      if (error) {
        console.error("Erro ao cadastrar:", error);
        toast({
          title: "Erro",
          description: "Ops! Não conseguimos registrar seus dados. Tente novamente em instantes.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Agradecemos seu cadastro. Link de acesso enviado para o seu email.",
      });

      setIsDialogOpen(false);
      setFormData({ nome_completo: "", email: "", whatsapp: "" });

    } catch (error) {
      console.error("Erro inesperado:", error);
      toast({
        title: "Erro",
        description: "Ops! Não conseguimos registrar seus dados. Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const plans = [
    {
      name: "Basic",
      description: "Perfeito para começar",
      price: 0,
      badge: "Para você",
      icon: BookOpen,
      features: [
        "3 ebooks por dia",
        "Acesso à plataforma ScribIA",
        "Biblioteca ScribIA de eventos",
        "Ebooks compactos não personalizados"
      ],
      cta: "Começar Grátis",
      ctaAction: "free"
    },
    {
      name: "Plus",
      description: "Para quem quer ilimitado",
      monthlyPrice: 68,
      annualPrice: 48,
      badge: "Mais Popular",
      icon: Link2,
      features: [
        "Livebooks personalizados ilimitados",
        "Tutor IA completo",
        "Dashboard avançado",
        "Integrações com plataformas",
        "Suporte prioritário"
      ],
      cta: "Assinar Agora",
      ctaAction: "plus",
      featured: true
    }
  ];


  const handleCTAClick = (action: string) => {
    if (action === "free") {
      setIsDialogOpen(true);
    } else {
      // Para outros CTAs, pode implementar outras ações
      toast({
        title: "Em breve",
        description: "Esta funcionalidade estará disponível em breve!",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Escolha o Plano Ideal para Você
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Soluções flexíveis que crescem com suas necessidades
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-sm font-medium">Mensal</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-primary' : 'bg-muted'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
          <span className="text-sm font-medium">
            Anual <small className="text-primary">(-20%)</small>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative shadow-elegant hover-scale ${
                  plan.featured ? 'border-2 border-primary scale-105 shadow-xl' : ''
                }`}
              >
                {plan.featured && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground"
                  >
                    {plan.badge}
                  </Badge>
                )}
                <CardHeader className="text-center pt-8">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    {plan.name === "Basic" ? (
                      <span className="text-4xl font-extrabold text-primary">Grátis</span>
                    ) : (
                      <>
                        <span className="text-xl text-muted-foreground">R$</span>
                        <span className="text-4xl font-extrabold text-primary mx-1">
                          {isAnnual ? plan.annualPrice?.toFixed(2).replace('.', ',') : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground">/mês</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    variant={plan.featured ? "default" : "outline"}
                    onClick={() => handleCTAClick(plan.ctaAction)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dialog for free plan */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Começar teste gratuito</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dialog-nome">Nome completo *</Label>
                <Input
                  id="dialog-nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dialog-email">E-mail *</Label>
                <Input
                  id="dialog-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dialog-whatsapp">Nº de WhatsApp *</Label>
                <Input
                  id="dialog-whatsapp"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.whatsapp}
                  onChange={handleWhatsAppChange}
                  maxLength={15}
                  required
                />
              </div>

              <Button
                onClick={handleFreeSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Enviando..." : "Começar teste gratuito"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PricingPlans;