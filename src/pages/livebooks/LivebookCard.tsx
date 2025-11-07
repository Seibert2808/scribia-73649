import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2, FileText, AlertTriangle } from "lucide-react";
import { LivebookWithPalestra, STATUS_LABELS, STATUS_COLORS, TIPO_RESUMO_LABELS } from "@/types/livebook";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LivebookCardProps {
  livebook: LivebookWithPalestra;
  onDelete: (id: string) => void;
}

export function LivebookCard({ livebook, onDelete }: LivebookCardProps) {
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
              <Button size="sm" variant="outline" asChild>
                <a href={livebook.pdf_url} download>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </a>
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
              <Button size="sm" variant="outline" asChild>
                <a href={livebook.docx_url} download>
                  <FileText className="h-4 w-4 mr-2" />
                  DOCX
                </a>
              </Button>
            )}
          </div>
        )}

        {/* Botão de exclusão */}
        <div className="flex justify-end pt-2 border-t">
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
