import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DemoSection = () => {
  return (
    <section id="demo" className="py-16 md:py-24 bg-gradient-to-b from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <PlayCircle className="h-4 w-4" /> Demonstração
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Veja o ScribIA em Ação
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Assista a uma demonstração rápida e descubra como transformar seus eventos em conhecimento contínuo.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-8">
          <div className="aspect-video bg-secondary/20 rounded-2xl flex items-center justify-center shadow-lg border">
            <div className="text-center text-muted-foreground italic">
              Vídeo de demonstração em breve
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button variant="cta" size="lg" asChild>
            <a href="#contato">Agendar Demonstração</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
