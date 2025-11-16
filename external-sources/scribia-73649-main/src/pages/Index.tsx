import NewHomepage from "@/components/sections/NewHomepage";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const title = "ScribIA — Transforme Eventos em Conhecimento Duradouro com IA";
  const description = "O ecossistema inteligente que conecta participantes, organizadores, palestrantes e patrocinadores, criando Livebooks personalizados em minutos e prolongando o impacto de cada evento.";
  const canonical = "/";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Helmet>

      <NewHomepage />
    </>
  );
};

export default Index;
