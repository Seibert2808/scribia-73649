import { Mail, MessageCircle, Book, Video, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Ajuda = () => {
  const handleEmailSupport = () => {
    window.location.href = "mailto:suporte@scribia.com.br";
  };

  return (
    <div className="p-4 sm:p-6 py-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Ajuda & Suporte</h1>
          <p className="text-muted-foreground text-xs md:text-sm lg:text-base">
            Estamos aqui para ajudar você a aproveitar ao máximo o ScribIA
          </p>
        </div>

        {/* Contato com Suporte - Destaque */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3 p-3 md:p-4 lg:p-6">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base md:text-lg lg:text-xl mb-0.5 md:mb-1">Precisa de Ajuda?</CardTitle>
                <CardDescription className="text-xs md:text-sm">
                  Nossa equipe está pronta para atender você
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-3 pt-0 md:p-4 md:pt-0 lg:p-6 lg:pt-0">
            <p className="text-xs md:text-sm lg:text-base text-muted-foreground">
              Se você está com dúvidas, problemas técnicos ou precisa de suporte, 
              entre em contato conosco através do email:
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2.5 md:p-3 lg:p-4 bg-background/80 backdrop-blur-sm rounded-lg border">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-primary flex-shrink-0" />
              <span className="font-mono text-xs md:text-sm lg:text-base break-all">suporte@scribia.com.br</span>
            </div>

            <Button 
              onClick={handleEmailSupport}
              className="w-full sm:w-auto h-9 md:h-10 text-xs md:text-sm"
            >
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
              Enviar Email
            </Button>
          </CardContent>
        </Card>

        {/* Recursos de Ajuda */}
        <div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-3">Recursos de Aprendizado</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
            <Card className="h-full">
              <CardHeader className="pb-2 md:pb-3 p-3 md:p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Book className="w-4 h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm md:text-base lg:text-lg">Documentação</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Guias detalhados sobre como usar todas as funcionalidades do ScribIA
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-4 md:pt-0 lg:p-6 lg:pt-0">
                <Button variant="outline" className="w-full h-8 md:h-9 text-xs md:text-sm" disabled>
                  Em breve
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="pb-2 md:pb-3 p-3 md:p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-4 h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <CardTitle className="text-sm md:text-base lg:text-lg">Tutoriais em Vídeo</CardTitle>
                </div>
                <CardDescription className="text-xs md:text-sm">
                  Aprenda através de vídeos passo a passo sobre o uso da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-4 md:pt-0 lg:p-6 lg:pt-0">
                <Button variant="outline" className="w-full h-8 md:h-9 text-xs md:text-sm" disabled>
                  Em breve
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <HelpCircle className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary flex-shrink-0" />
            <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">Perguntas Frequentes</h2>
          </div>
          
          <Card>
            <CardContent className="divide-y pt-3 md:pt-4 lg:pt-6 p-3 md:p-4 lg:p-6">
              <div className="pb-3 md:pb-4 lg:pb-6">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2">
                  Como gerar um livebook?
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Acesse "Gerar Livebook" no menu, selecione o evento e a palestra desejada, 
                  e clique em "Gerar Livebook". O processo pode levar alguns minutos.
                </p>
              </div>

              <div className="py-3 md:py-4 lg:py-6">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2">
                  Posso adicionar múltiplos arquivos de áudio?
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Sim! Ao criar ou editar uma palestra, você pode adicionar vários arquivos 
                  de áudio que serão processados e transcritos automaticamente.
                </p>
              </div>

              <div className="pt-3 md:pt-4 lg:pt-6">
                <h3 className="font-semibold text-sm md:text-base lg:text-lg mb-1 md:mb-2">
                  Quanto tempo demora para processar um áudio?
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                  O tempo de processamento varia de acordo com o tamanho do arquivo. 
                  Em média, áudios de 1 hora levam entre 5-10 minutos para serem processados.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default Ajuda;
