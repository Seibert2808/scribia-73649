import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Recebemos sua mensagem! Entraremos em contato em breve.");
  };

  return (
    <section id="contato" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold">Fale com a gente</h2>
          <p className="text-muted-foreground">Nos conte sobre seu evento e como podemos ajudar.</p>
        </div>

        <Card className="max-w-2xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seu@email.com" required />
              </div>
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea id="message" placeholder="Conte sobre seu evento" required />
            </div>
            <Button type="submit" className="w-full">Enviar</Button>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;