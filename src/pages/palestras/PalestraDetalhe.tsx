import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, Download, FileAudio, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/dashboard/PageLayout";
import { Palestra } from "@/types/palestra";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PalestraDetalhe = () => {
  const { eventoId, palestraId } = useParams<{ eventoId: string; palestraId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [palestra, setPalestra] = useState<Palestra | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (palestraId) {
      fetchPalestra();
    }
  }, [palestraId]);

  const fetchPalestra = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scribia_palestras")
        .select("*")
        .eq("id", palestraId!)
        .single();

      if (error) throw error;
      setPalestra(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar palestra",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Palestra['status']) => {
    const variants: Record<Palestra['status'], { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      aguardando: { label: "Aguardando", variant: "outline" },
      processando: { label: "Processando", variant: "secondary" },
      concluido: { label: "Concluído", variant: "default" },
      erro: { label: "Erro", variant: "destructive" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  if (!palestra) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Palestra não encontrada</p>
              <Button
                onClick={() => navigate(`/eventos/${eventoId}/palestras`)}
                className="mt-4"
              >
                Voltar para Palestras
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(`/eventos/${eventoId}/palestras`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Palestras
          </Button>

          <Button
            onClick={() => navigate(`/eventos/${eventoId}/palestras/${palestraId}/editar`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl">{palestra.titulo}</CardTitle>
                {palestra.palestrante && (
                  <CardDescription className="text-lg mt-2">
                    Por: {palestra.palestrante}
                  </CardDescription>
                )}
              </div>
              {getStatusBadge(palestra.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Nível de Conhecimento</h3>
                {palestra.nivel_escolhido ? (
                  <Badge variant="outline" className="text-base">
                    {palestra.nivel_escolhido === "junior" && "Júnior"}
                    {palestra.nivel_escolhido === "pleno" && "Pleno"}
                    {palestra.nivel_escolhido === "senior" && "Sênior"}
                  </Badge>
                ) : (
                  <p className="text-muted-foreground">Não definido</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Formato</h3>
                {palestra.formato_escolhido ? (
                  <Badge variant="secondary" className="text-base">
                    {palestra.formato_escolhido === "completo" && "Completo"}
                    {palestra.formato_escolhido === "compacto" && "Compacto"}
                  </Badge>
                ) : (
                  <p className="text-muted-foreground">Não definido</p>
                )}
              </div>
            </div>

            {/* Tags */}
            {palestra.tags_tema && palestra.tags_tema.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags/Temas</h3>
                <div className="flex flex-wrap gap-2">
                  {palestra.tags_tema.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Classificação */}
            <div>
              <h3 className="font-semibold mb-2">Origem da Classificação</h3>
              <Badge variant={palestra.origem_classificacao === "auto" ? "default" : "secondary"}>
                {palestra.origem_classificacao === "auto" ? "Automática (IA)" : "Manual"}
              </Badge>
              {palestra.confidence && (
                <p className="text-sm text-muted-foreground mt-1">
                  Confiança: {Math.round(palestra.confidence * 100)}%
                </p>
              )}
            </div>

            {/* Materiais */}
            <div className="space-y-4">
              <h3 className="font-semibold">Materiais</h3>

              {palestra.audio_url && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileAudio className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Áudio da Palestra</CardTitle>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={palestra.audio_url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              )}

              {palestra.slides_url && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Slides (PDF)</CardTitle>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={palestra.slides_url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              )}

              {palestra.transcricao_url && (
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">Transcrição</CardTitle>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href={palestra.transcricao_url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              )}

              {!palestra.audio_url && !palestra.slides_url && !palestra.transcricao_url && (
                <p className="text-muted-foreground">Nenhum material disponível ainda.</p>
              )}
            </div>

            {/* Webhook */}
            {palestra.webhook_destino && (
              <div>
                <h3 className="font-semibold mb-2">Webhook de Processamento</h3>
                <code className="text-xs bg-muted p-2 rounded block overflow-x-auto">
                  {palestra.webhook_destino}
                </code>
              </div>
            )}

            {/* Datas */}
            <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
              <div>
                <strong>Criado em:</strong>{" "}
                {format(new Date(palestra.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
              <div>
                <strong>Atualizado em:</strong>{" "}
                {format(new Date(palestra.atualizado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PalestraDetalhe;
