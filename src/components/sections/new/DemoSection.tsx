import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const DemoSection = () => {
  const handleDemoClick = () => {
    window.open("https://cal.com/", "_blank");
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Play className="h-3 w-3" /> DEMO
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Veja uma demonstração</h2>
            <p className="text-muted-foreground mb-6">
              Assista a uma demonstração do ScribIA em funcionamento e entenda como os Livebooks são gerados e distribuídos em poucos minutos.
            </p>
            <Button onClick={handleDemoClick} size="lg">Agendar demo</Button>
          </div>
          <div className="bg-muted/30 rounded-xl aspect-video flex items-center justify-center">
            <div className="text-muted-foreground">Vídeo de demo (placeholder)</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;