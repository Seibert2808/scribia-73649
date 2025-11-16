import { Mail } from "lucide-react";

const NewFooter = () => {
  return (
    <footer className="bg-card border-t mt-8">
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/lovable-uploads/scribia-logo-new.png" alt="ScribIA" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-muted-foreground">
              Transformando eventos em conhecimento duradouro através da inteligência artificial.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-primary">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#recursos" className="text-muted-foreground hover:text-primary transition-colors">Recursos</a></li>
              <li><a href="#precos" className="text-muted-foreground hover:text-primary transition-colors">Preços</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrações</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-primary">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sobre</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Carreiras</a></li>
              <li><a href="#contato" className="text-muted-foreground hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-primary">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentação</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Status</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ScribIA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
