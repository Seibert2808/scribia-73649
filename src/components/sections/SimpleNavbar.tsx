import { useState, useEffect } from "react";
import { keyBlackToTransparent } from "@/utils/image";
import { SITE } from "@/utils/constants";

const SimpleNavbar = () => {
  const [logoSrc, setLogoSrc] = useState("/lovable-uploads/scribia-logo-new.png");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    keyBlackToTransparent("/lovable-uploads/scribia-logo-new.png", 24)
      .then(setLogoSrc)
      .catch(() => {});

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/98 shadow-md backdrop-blur-md" : "bg-background/98 backdrop-blur-md"
      } border-b`}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center h-12">
          <img src={logoSrc} alt={`${SITE.name} logo`} className="h-full w-auto" />
        </a>
        
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium mx-auto">
          <li><a href="/#solucao" className="hover:text-primary transition-colors">Solução</a></li>
          <li><a href="/#recursos" className="hover:text-primary transition-colors">Recursos</a></li>
          <li><a href="/#precos" className="hover:text-primary transition-colors">Preços</a></li>
          <li><a href="/#faq" className="hover:text-primary transition-colors">FAQ</a></li>
          <li><a href="/#contato" className="hover:text-primary transition-colors">Contato</a></li>
        </ul>

        <div className="hidden md:block w-32"></div>
      </nav>
    </header>
  );
};

export default SimpleNavbar;
