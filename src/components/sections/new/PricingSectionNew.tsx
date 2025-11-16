import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Mensal",
    price: "R$ 299",
    description: "Ideal para eventos recorrentes e pequenos organizadores.",
    features: [
      "Geração de Livebooks ilimitada",
      "Distribuição via QR Code e email",
      "Suporte padrão",
      "Acesso à BIA",
    ],
    highlight: false,
  },
  {
    name: "Anual",
    price: "R$ 2.999",
    description: "Melhor custo-benefício para grandes organizadores.",
    features: [
      "Tudo do plano Mensal",
      "Relatórios avançados",
      "Painel de patrocinadores",
      "Suporte premium",
    ],
    highlight: true,
  },
];

const PricingSectionNew = () => {
  const handleContactClick = () => {
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="precos" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Planos e Preços</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades. Personalizamos soluções de acordo com o tipo e porte do seu evento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((p, idx) => (
            <Card key={idx} className={`p-6 ${p.highlight ? 'border-primary border-2 shadow-lg' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold">{p.name}</h3>
                  <p className="text-muted-foreground">{p.description}</p>
                </div>
                <div className="text-3xl font-extrabold text-primary">{p.price}</div>
              </div>

              <ul className="space-y-3 mb-6">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button size="lg" className="w-full" onClick={handleContactClick}>
                Falar com o time
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSectionNew;