import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, BookOpen, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  nome_completo: string;
  email: string;
  whatsapp: string;
}

const FreeTrial = () => {
  const [formData, setFormData] = useState<FormData>({
    nome_completo: "",
    email: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
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

      setFormData({
        nome_completo: "",
        email: "",
        whatsapp: "",
      });

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

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Experimente o ScribIA agora, grátis
              </h2>
              <p className="text-lg text-muted-foreground">
                Teste individual: envie um áudio ou use um conteúdo de demonstração e receba seu ebook compacto em PDF.
              </p>
            </div>

            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Teste Gratuito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Nº de WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.whatsapp}
                    onChange={handleWhatsAppChange}
                    maxLength={15}
                    required
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Enviando..." : "QUERO TESTAR AGORA"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Mockup */}
          <div className="flex justify-center">
            <Card className="w-full max-w-sm shadow-glow hover-scale">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Ebook Compacto ScribIA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="/lovable-uploads/eea4b268-0c4d-455e-87ea-3f1472c8f707.png"
                    alt="Ebook Compacto ScribIA - Tablet mostrando conteúdo organizado em PDF"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Pronto para compartilhar e aplicar
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeTrial;