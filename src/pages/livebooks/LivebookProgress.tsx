import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import { StatusLivebook, STATUS_LABELS } from "@/types/livebook";

interface LivebookProgressProps {
  status: StatusLivebook;
  titulo: string;
  erro?: string | null;
}

export function LivebookProgress({ status, titulo, erro }: LivebookProgressProps) {
  const getProgressValue = () => {
    switch (status) {
      case 'aguardando':
        return 0;
      case 'transcrevendo':
        return 33;
      case 'processando':
        return 66;
      case 'concluido':
        return 100;
      case 'erro':
        return 0;
      default:
        return 0;
    }
  };

  const getIcon = () => {
    if (status === 'concluido') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (status === 'erro') {
      return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
    return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{titulo}</CardTitle>
          {getIcon()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={status === 'concluido' ? 'default' : status === 'erro' ? 'destructive' : 'secondary'}>
              {STATUS_LABELS[status]}
            </Badge>
          </div>

          {status !== 'erro' && status !== 'concluido' && (
            <Progress value={getProgressValue()} className="w-full" />
          )}
        </div>

        {erro && status === 'erro' && (
          <div className="p-3 bg-destructive/10 rounded-md">
            <p className="text-sm text-destructive">{erro}</p>
          </div>
        )}

        {status === 'transcrevendo' && (
          <p className="text-sm text-muted-foreground">
            Convertendo áudio em texto usando IA...
          </p>
        )}

        {status === 'processando' && (
          <p className="text-sm text-muted-foreground">
            Gerando Livebook personalizado...
          </p>
        )}

        {status === 'concluido' && (
          <p className="text-sm text-green-600 font-medium">
            ✓ Livebook gerado com sucesso!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
