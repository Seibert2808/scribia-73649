import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSectionNew = () => {
  const faqs = [
    {
      question: "Como funciona o ScribIA?",
      answer: "O ScribIA captura o conteúdo de palestras e eventos, processa com inteligência artificial para identificar insights e gera Livebooks personalizados em minutos. Depois, distribui o material e oferece um tutor IA para apoiar o aprendizado contínuo."
    },
    {
      question: "Quais formatos de Livebook estão disponíveis?",
      answer: "Os Livebooks podem ser gerados em PDF, Word ou em uma versão web/mobile interativa, oferecendo flexibilidade para diferentes preferências de leitura."
    },
    {
      question: "Como posso integrar o ScribIA ao meu evento?",
      answer: "Nossa plataforma se integra facilmente com Zoom, Teams, Sympla, Eventbrite e outras ferramentas de eventos. Basta conectar a sua conta e começar a capturar o conteúdo."
    },
    {
      question: "O ScribIA oferece suporte a múltiplos idiomas?",
      answer: "Sim. O processamento de IA inclui transcrição multilíngue, permitindo que você crie Livebooks em diferentes idiomas conforme a necessidade do seu público."
    }
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <HelpCircle className="h-4 w-4" /> Perguntas Frequentes
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire suas dúvidas sobre o ScribIA
          </p>
        </div>
        
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-left font-semibold text-primary hover:text-primary/80">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSectionNew;
