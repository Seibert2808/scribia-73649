import { SITE } from "@/utils/constants";
import { Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t mt-8">
      <div className="container mx-auto py-10 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-semibold text-lg">{SITE.name}</h3>
          <p className="text-muted-foreground mt-2">Transcrição e resumo inteligente para congressos acadêmicos.</p>
        </div>
        <div className="md:justify-self-end">
          <a href={`mailto:${SITE.contactEmail}`} className="inline-flex items-center gap-2 story-link">
            <Mail className="h-4 w-4" /> {SITE.contactEmail}
          </a>
          <div className="mt-3 text-sm text-muted-foreground">© {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
