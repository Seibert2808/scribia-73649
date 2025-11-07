import { Button } from "@/components/ui/button";
import { SITE } from "@/utils/constants";
import { useEffect, useState } from "react";
import { keyBlackToTransparent } from "@/utils/image";
const Navbar = () => {
  const [logoSrc, setLogoSrc] = useState("/lovable-uploads/scribia-logo-new.png");
  useEffect(() => {
    keyBlackToTransparent("/lovable-uploads/scribia-logo-new.png", 24)
      .then(setLogoSrc)
      .catch(() => {});
  }, []);
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href="/">← Voltar</a>
          </Button>
          <a href="#hero" className="flex items-center gap-2 font-semibold">
            <img src={logoSrc} alt={`${SITE.name} logo`} className="h-10 w-auto" />
          </a>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#problema" className="hover:text-foreground transition-colors">Problema</a>
          <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
          <a href="#beneficios" className="hover:text-foreground transition-colors">Benefícios</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/login">
            <Button variant="outline" size="default">Login</Button>
          </a>
          <a href="https://scribia.lovable.app/teste-gratuito" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="default">Teste Gratuito</Button>
          </a>
          <a href="/cadastro">
            <Button variant="cta" size="default" className="hover-scale">Criar Conta</Button>
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
