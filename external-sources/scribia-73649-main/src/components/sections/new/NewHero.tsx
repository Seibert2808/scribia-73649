import { Button } from "@/components/ui/button";
import { Play, Info, Users, Calendar, Mic, Handshake, ArrowRight } from "lucide-react";
import heroBackground from "@/assets/images/hero-background.svg";

const NewHero = () => {
  return (
    <section id="hero" className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
      <div className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${heroBackground})`}} />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/80 to-background/60" />
      
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-4 py-2 rounded-full text-sm mb-6">
          <img src="/lovable-uploads/scribia-logo-new.png" alt="S" className="w-5 h-5" />
          <span className="font-semibold">Powered by AI</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Transforme Eventos em Conhecimento Duradouro com IA
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
          O ecossistema inteligente que conecta participantes, organizadores, palestrantes e patrocinadores, 
          criando Livebooks personalizados em minutos e prolongando o impacto de cada evento.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Button variant="outline" size="lg" asChild>
            <a href="#como-funciona" className="flex items-center gap-2">
              <Info className="h-5 w-5" /> Ver como funciona
            </a>
          </Button>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          <a 
            href="/participantes" 
            className="group bg-background/80 backdrop-blur-md border-2 border-primary/20 hover:border-primary hover:bg-background hover:shadow-xl p-6 rounded-2xl transition-all hover:-translate-y-2 cursor-pointer min-w-[160px]"
          >
            <Users className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-sm mb-2">Sou Participante</h4>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              <span>Clique aqui</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
          <div className="group bg-background/80 backdrop-blur-md border-2 border-primary/20 hover:border-primary hover:bg-background hover:shadow-xl p-6 rounded-2xl transition-all hover:-translate-y-2 cursor-pointer min-w-[160px]">
            <Calendar className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-sm mb-2">Sou Organizador</h4>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              <span>Clique aqui</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="group bg-background/80 backdrop-blur-md border-2 border-primary/20 hover:border-primary hover:bg-background hover:shadow-xl p-6 rounded-2xl transition-all hover:-translate-y-2 cursor-pointer min-w-[160px]">
            <Mic className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-sm mb-2">Sou Palestrante</h4>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              <span>Clique aqui</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="group bg-background/80 backdrop-blur-md border-2 border-primary/20 hover:border-primary hover:bg-background hover:shadow-xl p-6 rounded-2xl transition-all hover:-translate-y-2 cursor-pointer min-w-[160px]">
            <Handshake className="h-10 w-10 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-sm mb-2">Sou Patrocinador</h4>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              <span>Clique aqui</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHero;
