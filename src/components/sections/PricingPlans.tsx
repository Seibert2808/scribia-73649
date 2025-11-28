import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  nome_completo: string;
  email: string;
  whatsapp: string;
}

const plans = [
  {
    name: "Basic",
    description: "Perfeito para começar",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "3 ebooks por dia",
      "Acesso à plataforma ScribIA",
      "Biblioteca ScribIA de eventos",
      "Ebooks compactos não personalizados",
    ],
    cta: "Começar Grátis",
    ctaAction: "free",
    featured: false,
  },
  {
    name: "Plus",
    description: "Para quem quer ilimitado",
    monthlyPrice: 68,
    annualPrice: 48,
    features: [
      "Livebooks personalizados ilimitados",
      "Tutor IA completo",
      "Dashboard avançado",
      "Integrações com plataformas",
      "Suporte prioritário",
    ],
    cta: "Assinar Agora",
    ctaAction: "plus",
    featured: true,
  },
];

const PricingPlans = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome_completo: "",
    email: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleCTAClick = (action: string) => {
    if (action === "free") {
      window.location.href = "https://www.scribia.app.br";
      return;
    } else {
      toast({
        title: "Em breve",
        description: "Esta funcionalidade estará disponível em breve!",
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Tag className="h-4 w-4" /> Planos e Preços
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Planos para você
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o que faz sentido agora — evolua quando precisar.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-sm font-medium">Mensal</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? "bg-primary" : "bg-muted"}`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${isAnnual ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <span className="text-sm font-medium">
            Anual <small className="text-primary">(-20%)</small>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={`relative hover:-translate-y-1 transition-all ${
                plan.featured ? "border-2 border-primary scale-105 shadow-xl" : ""
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold">
                  MAIS POPULAR
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-center pb-4 border-b mb-4">
                  <h3 className="text-xl font-bold text-primary mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="flex items-baseline justify-center my-6">
                  {plan.monthlyPrice === 0 ? (
                    <span className="text-3xl font-bold text-primary">Grátis</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-primary mr-1">
                        R$ {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-sm text-muted-foreground">/mês</span>
                    </>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.featured ? "default" : "outline"}
                  size="lg"
                  className="w-full"
                  onClick={() => handleCTAClick(plan.ctaAction)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
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
