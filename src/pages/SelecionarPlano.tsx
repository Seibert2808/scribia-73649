import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { BookOpen, Link2 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const planos = [
  {
    id: "basic",
    name: "Basic",
    price: "Grátis",
    icon: BookOpen,
    features: [
      "Até 3 palestras convertidas em ebooks compactos",
      "PDF com estrutura padrão",
      "Acesso individual para teste",
    ],
    cta: "Continuar com Basic",
  },
  {
    id: "plus",
    name: "Plus",
    price: "B2C",
    icon: Link2,
    features: [
      "Ebooks na versão compacto ou completo",
      "Links interativos e referências complementares",
    ],
    cta: "Continuar com Plus",
  },
];

const SelecionarPlano = () => {
  const navigate = useNavigate();

  const continuar = (plano: string) => {
    navigate(`/cadastro?plano=${plano}`);
  };

  return (
    <>
      <Helmet>
        <title>Escolha seu Plano - ScribIA</title>
        <link rel="canonical" href="https://www.scribia.app.br/selecionar-plano" />
      </Helmet>

      <section className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary">← Voltar para a Home</a>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold">Selecione seu plano</h1>
            <p className="text-muted-foreground">Escolha entre Basic e Plus para continuar com o cadastro</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {planos.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Card key={idx} className="p-6 shadow-elegant">
                  <div className="text-center mb-6">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    <p className="text-lg font-bold text-primary">{p.price}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" onClick={() => continuar(p.id)}>
                    {p.cta}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default SelecionarPlano;