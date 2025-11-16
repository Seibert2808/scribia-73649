import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  nome_completo: string;
  email: string;
  whatsapp: string;
}

const TesteGratuito = () => {
  const [formData, setFormData] = useState<FormData>({
    nome_completo: "",
    email: "",
    whatsapp: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const normalizeWhatsApp = (value: string): string => {
    return value.replace(/\D/g, "");
  };

  const validateWhatsApp = (whatsapp: string): boolean => {
    const normalized = normalizeWhatsApp(whatsapp);
    return normalized.length >= 10 && normalized.length <= 11;
  };

  const formatWhatsApp = (value: string): string => {
    const numbers = normalizeWhatsApp(value);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setFormData({ ...formData, whatsapp: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome_completo.trim()) {
      toast.error("Por favor, preencha seu nome completo");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    if (!validateWhatsApp(formData.whatsapp)) {
      toast.error("Por favor, insira um WhatsApp válido com DDD");
      return;
    }

    setIsSubmitting(true);

    try {
      const whatsappDigits = normalizeWhatsApp(formData.whatsapp);
      const { data, error } = await supabase.functions.invoke('scribia-free-signup', {
        body: {
          nome_completo: formData.nome_completo,
          email: formData.email,
          whatsapp: whatsappDigits,
        }
      });

      if (error) {
        console.error("Erro ao cadastrar:", error);
        toast.error("Erro ao processar cadastro. Tente novamente.");
        return;
      }

      toast.success("Agradecemos seu cadastro. Link de acesso enviado para o seu email.");
      
      setFormData({
        nome_completo: "",
        email: "",
        whatsapp: "",
      });
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao processar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Teste Gratuito ScribIA | Experimente Agora</title>
        <meta 
          name="description" 
          content="Experimente o ScribIA gratuitamente. Teste individual: envie um áudio ou use conteúdo de demonstração e receba seu ebook compacto em PDF." 
        />
        <meta property="og:title" content="Teste Gratuito ScribIA | Experimente Agora" />
        <meta 
          property="og:description" 
          content="Experimente o ScribIA gratuitamente. Teste individual: envie um áudio ou use conteúdo de demonstração e receba seu ebook compacto em PDF." 
        />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <img 
              src="/lovable-uploads/scribia-logo-new.png" 
              alt="ScribIA Logo" 
              className="h-16 w-auto mx-auto mb-8"
            />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] bg-clip-text text-transparent mb-3">
              Experimente o ScribIA agora!
            </h1>
            <p className="text-muted-foreground">
              Teste gratuitamente: envie um áudio ou grave um conteúdo ao vivo e faça o download do seu ebook compacto em PDF ou docx.
            </p>
          </div>

          {/* Formulário */}
          <Card className="p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_completo">Nome completo *</Label>
                <Input
                  id="nome_completo"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome_completo}
                  onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={handleWhatsAppChange}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "PROCESSANDO..." : "QUERO TESTAR AGORA"}
              </Button>
            </form>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Ao se cadastrar, você receberá um link de acesso por e-mail para testar o ScribIA gratuitamente.
          </p>
        </div>
      </main>
    </>
  );
};

export default TesteGratuito;
