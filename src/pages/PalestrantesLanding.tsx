import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import Footer from "@/components/sections/Footer";

const PalestrantesLanding = () => {
  const title = "ScribIA — Palestrantes e Influenciadores";
  const description = "Transforme cada palestra em presença contínua, autoridade e novas oportunidades com Livebooks inteligentes e métricas reais de interesse.";
  const canonical = "/palestrantes";

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é um Livebook?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "É um material estruturado e memorável gerado pela IA a partir da sua fala, com destaques, frases marcantes e aplicações práticas.",
        },
      },
      {
        "@type": "Question",
        name: "Quem envia o áudio da palestra?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "O próprio público pode gravar e enviar, sem exigir nada extra de você.",
        },
      },
      {
        "@type": "Question",
        name: "Como acompanho o interesse da audiência?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Você acessa métricas que mostram quais trechos geraram mais atenção e onde aprofundar sua mensagem.",
        },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <main>
        <div className="container mx-auto px-4 mt-4">
          <Button variant="outline" asChild>
            <a href="/">Voltar para a Home</a>
          </Button>
        </div>

        <section className="container mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
            Transforme cada palestra em presença contínua, autoridade e novas oportunidades
          </h1>

          <h2 className="text-2xl font-bold mb-4">O Palestrante ou Influenciador que Escolhe o ScribIA</h2>
          <p className="text-muted-foreground mb-4">
            Você sabe que cada apresentação, aula, palestra ou conversa é muito mais do que 40 minutos no palco. É a condensação do que você estudou, viveu, testou e ensinou.
          </p>
          <p className="text-muted-foreground mb-4">Mas você já se perguntou:</p>
          <ul className="list-disc pl-6 space-y-1 mb-6 text-muted-foreground">
            <li>Quem realmente lembra do que você ensinou depois do evento?</li>
            <li>Como manter sua influência viva mesmo quando você não está ao vivo?</li>
            <li>Como fazer seu conteúdo continuar circulando, sendo citado e compartilhado?</li>
            <li>Como descobrir o que o público realmente quer aprender de você?</li>
            <li>Como transformar cada palestra em um ativo que gera novas vendas ou convites?</li>
          </ul>

          <p className="text-muted-foreground mb-6">
            O ScribIA existe para isso: para transformar sua fala em autoridade contínua, presença ampliada e oportunidades reais — mesmo quando você está offline.
          </p>

          <h2 className="text-2xl font-bold mb-4">Benefícios do ScribIA para Palestrantes ou Influenciadores</h2>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><span className="font-semibold">Ser lembrado além do momento ao vivo:</span> Sua fala vira um Livebook estruturado e memorável.</li>
            <li><span className="font-semibold">Aumentar sua autoridade como especialista:</span> Livebooks circulam, viralizam trechos e reforçam sua credibilidade.</li>
            <li><span className="font-semibold">Ser mais referenciado e encontrado:</span> Conteúdo citável, pesquisável e fácil de referenciar.</li>
            <li><span className="font-semibold">Entender o que o público realmente quer:</span> Métricas mostram os trechos que geram mais atenção.</li>
            <li><span className="font-semibold">Criar produtos alinhados à demanda real:</span> Mentorias, cursos e trilhas nascem das métricas.</li>
            <li><span className="font-semibold">Transformar cada palestra em um portfólio vivo:</span> Use os Livebooks em propostas, vendas e redes.</li>
            <li><span className="font-semibold">Ser encontrado por novos públicos e convites:</span> O texto organizado expande organicamente seu alcance.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Como Funciona Para Palestrantes ou Influenciadores</h2>
          <ol className="list-decimal pl-6 space-y-4 mb-8">
            <li>
              <p className="font-semibold">Seu público envia o áudio da sua fala</p>
              <p className="text-muted-foreground">Eles mesmos gravam e enviam — sem exigir nada extra de você.</p>
            </li>
            <li>
              <p className="font-semibold">A IA transforma sua apresentação em um Livebook</p>
              <p className="text-muted-foreground">Com estrutura, destaques, frases marcantes e aplicações práticas.</p>
            </li>
            <li>
              <p className="font-semibold">Você recebe o Livebook pronto para divulgar</p>
              <p className="text-muted-foreground">Ele entra no seu portfólio e na sua estratégia de autoridade.</p>
            </li>
            <li>
              <p className="font-semibold">Você acompanha o interesse real da audiência</p>
              <p className="text-muted-foreground">As métricas mostram temas mais atrativos e onde aprofundar sua mensagem.</p>
            </li>
          </ol>

          <h2 className="text-2xl font-bold mb-4">Por que Palestrantes ou Influenciadores Amam o ScribIA?</h2>
          <p className="text-muted-foreground mb-2">Porque finalmente existe um jeito de:</p>
          <ul className="list-disc pl-6 space-y-1 mb-8 text-muted-foreground">
            <li>ser lembrado,</li>
            <li>ser encontrado,</li>
            <li>ser referenciado,</li>
            <li>ser procurado,</li>
            <li>e ser desejado como especialista — não só pelo que você fala, mas pelo que o seu conteúdo continua gerando depois que você sai do palco.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4">Leve o ScribIA para sua próxima apresentação</h2>
          <p className="mb-6">Transforme cada fala em legado, autoridade e oportunidade — como Palestrante ou Influenciador.</p>

          <div className="mt-4">
            <Button size="lg" className="bg-primary text-primary-foreground" asChild>
              <a href="/teste-gratuito">Quero transformar minha fala em Livebooks</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PalestrantesLanding;