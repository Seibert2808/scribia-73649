import { Card } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

const testimonials = [
  {
    name: "Ana Rodrigues",
    role: "Diretora de Marketing",
    quote: "Os Livebooks elevaram a qualidade dos nossos eventos e aumentaram o engajamento." ,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    name: "Carlos Lima",
    role: "Organizador de Conferências",
    quote: "A distribuição de conteúdo foi impecável e os patrocinadores ficaram impressionados.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

const metrics = [
  { label: "+85%", desc: "Aumento no acesso ao conteúdo pós-evento" },
  { label: "3 min", desc: "Tempo médio para entrega do Livebook" },
  { label: "+40%", desc: "Melhora no retorno para patrocinadores" },
  { label: "NPS 9.2", desc: "Satisfação geral dos participantes" },
];

const MetricsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Resultados e Depoimentos</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Veja alguns números obtidos em eventos onde o ScribIA foi utilizado, além de depoimentos de quem já
              experimentou a nossa plataforma.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {metrics.map((m, idx) => (
                <Card key={idx} className="p-6 text-center">
                  <div className="text-3xl font-extrabold text-primary mb-2">{m.label}</div>
                  <div className="text-muted-foreground">{m.desc}</div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <p className="text-muted-foreground mb-4">“{t.quote}”</p>
                </div>
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full"
                    src={t.videoUrl}
                    title={`Depoimento de ${t.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;