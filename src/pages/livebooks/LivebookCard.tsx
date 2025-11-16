import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2, FileText, AlertTriangle } from "lucide-react";
import { LivebookWithPalestra, STATUS_LABELS, STATUS_COLORS, TIPO_RESUMO_LABELS } from "@/types/livebook";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface LivebookCardProps {
  livebook: LivebookWithPalestra;
  onDelete: (id: string) => void;
}

export function LivebookCard({ livebook, onDelete }: LivebookCardProps) {
  const navigate = useNavigate();
  
  const handleDownload = async (url: string, filename: string) => {
    try {
      toast.info('Baixando arquivo...');
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Download concluído!');
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const getStatusBadge = () => {
    const colorClass = STATUS_COLORS[livebook.status];
    return (
      <Badge className={colorClass}>
        {STATUS_LABELS[livebook.status]}
      </Badge>
    );
  };

  const hasFiles = livebook.pdf_url || livebook.html_url || livebook.docx_url;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{livebook.palestra.titulo}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {TIPO_RESUMO_LABELS[livebook.tipo_resumo]}
            </p>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data de criação */}
        <p className="text-xs text-muted-foreground">
          Criado em: {format(new Date(livebook.criado_em), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>

        {/* Tempo de processamento */}
        {livebook.tempo_processamento && (
          <p className="text-xs text-muted-foreground">
            Processado em: {Math.round(livebook.tempo_processamento)} segundos
          </p>
        )}

        {/* Erro */}
        {livebook.status === 'erro' && livebook.erro_log && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
            <p className="text-xs text-destructive">{livebook.erro_log}</p>
          </div>
        )}

        {/* Botões de ação */}
        {livebook.status === 'concluido' && hasFiles && (
          <div className="flex flex-wrap gap-2">
            {livebook.pdf_url && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload(livebook.pdf_url!, `${livebook.palestra.titulo}.pdf`)}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            )}
            {livebook.html_url && (
              <Button size="sm" variant="outline" asChild>
                <a href={livebook.html_url} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Online
                </a>
              </Button>
            )}
            {livebook.docx_url && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDownload(livebook.docx_url!, `${livebook.palestra.titulo}.docx`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                DOCX
              </Button>
            )}
          </div>
        )}

        {/* Botões de ações */}
        <div className="flex justify-between items-center pt-2 border-t gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/dashboard/livebooks/${livebook.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(livebook.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
