import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, AlertTriangle, Download, FileText } from 'lucide-react';
import { livebooksApi } from '@/services/api';
import { toast } from 'sonner';
import type { StatusLivebook } from '@/types/livebook';

interface LivebookProgressProps {
  palestraId: string;
  userId: string;
  onComplete?: (livebookId: string) => void;
}

interface LivebookData {
  id: string;
  status: StatusLivebook;
  pdf_url: string | null;
  html_url: string | null;
  docx_url: string | null;
  tipo_resumo: string;
  erro_log: string | null;
  palestra: {
    titulo: string;
    palestrante: string | null;
  };
}

export function LivebookProgress({ palestraId, userId, onComplete }: LivebookProgressProps) {
  const [livebook, setLivebook] = useState<LivebookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [waitingForCreation, setWaitingForCreation] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let currentAttempt = 0;
    const MAX_ATTEMPTS = 120; // 120 tentativas = 6 minutos (3s cada)

    console.log('🔍 LivebookProgress montado para palestra:', palestraId);

    const fetchLivebookStatus = async () => {
      try {
        currentAttempt++;
        setAttemptCount(currentAttempt);
        console.log(`🔄 Tentativa ${currentAttempt} - Buscando livebook para palestra:`, palestraId);

        const response = await livebooksApi.getByPalestra(palestraId);
        const livebooks = response.data.data || response.data;

        if (livebooks && livebooks.length > 0) {
          const livebookData = {
            id: livebooks[0].id,
            status: livebooks[0].status as StatusLivebook,
            pdf_url: livebooks[0].pdf_url,
            html_url: livebooks[0].html_url,
            docx_url: livebooks[0].docx_url,
            tipo_resumo: livebooks[0].tipo_resumo,
            erro_log: livebooks[0].erro_log,
            palestra: {
              titulo: livebooks[0].titulo_palestra || livebooks[0].titulo,
              palestrante: livebooks[0].palestrante
            }
          } as LivebookData;
          
          console.log('✅ Livebook encontrado:', livebookData.id, 'Status:', livebookData.status);
          setLivebook(livebookData);
          setLoading(false);
          setWaitingForCreation(false);

          // Se concluído, parar polling e notificar
          if (livebookData.status === 'concluido') {
            console.log('🎉 Livebook concluído!');
            clearInterval(intervalId);
            toast.success('Livebook concluído! 🎉');
            onComplete?.(livebookData.id);
          }

          // Se erro, parar polling
          if (livebookData.status === 'erro') {
            console.log('❌ Erro no processamento do livebook');
            clearInterval(intervalId);
            toast.error('Erro ao gerar livebook');
          }
        } else {
          console.log('⏳ Livebook ainda não criado, aguardando...');
          setLoading(false);
          setWaitingForCreation(true);
        }

        // Timeout máximo
        if (currentAttempt >= MAX_ATTEMPTS) {
          console.error('⏱️ Timeout: Número máximo de tentativas atingido');
          clearInterval(intervalId);
          toast.error('Tempo limite excedido. Por favor, recarregue a página.');
        }
      } catch (err) {
        console.error('❌ Erro ao verificar status:', err);
      }
    };

    // Buscar imediatamente
    fetchLivebookStatus();

    // Polling a cada 3 segundos (mais responsivo)
    intervalId = setInterval(fetchLivebookStatus, 3000);

    return () => {
      console.log('🔚 LivebookProgress desmontado');
      clearInterval(intervalId);
    };
  }, [palestraId, userId]);

  const getProgressValue = () => {
    if (!livebook) return 0;
    
    const statusProgress: Record<StatusLivebook, number> = {
      aguardando: 10,
      transcrevendo: 40,
      processando: 70,
      concluido: 100,
      erro: 0,
    };

    return statusProgress[livebook.status] || 0;
  };

  const getStatusLabel = () => {
    if (!livebook) return 'Aguardando...';
    
    const labels: Record<StatusLivebook, string> = {
      aguardando: 'Iniciando processamento...',
      transcrevendo: 'Transcrevendo áudio... 🎙️',
      processando: 'Gerando seu Livebook personalizado... 🤖',
      concluido: 'Livebook Concluído! ✅',
      erro: 'Erro no processamento',
    };

    return labels[livebook.status] || 'Processando...';
  };

  const getStatusIcon = () => {
    if (!livebook) return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
    
    if (livebook.status === 'concluido') {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    
    if (livebook.status === 'erro') {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }

    return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
  };

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

  if (loading && attemptCount === 0) {
    return (
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <p className="text-sm text-muted-foreground">Carregando informações...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se está aguardando criação do livebook
  if (waitingForCreation && !livebook) {
    return (
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-lg">Iniciando processamento...</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Progress value={5} className="h-3" />
            <p className="text-sm text-muted-foreground text-center">
              Preparando seu Livebook personalizado... 🚀
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Tentativa {attemptCount} - Isso pode levar alguns segundos
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!livebook) {
    return null;
  }

  return (
    <Card className={`border-2 ${
      livebook.status === 'concluido' 
        ? 'border-green-200 bg-green-50/50' 
        : livebook.status === 'erro'
        ? 'border-red-200 bg-red-50/50'
        : 'border-blue-200 bg-blue-50/50'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="text-lg">
              {livebook.status === 'concluido' ? '✨ Livebook Pronto!' : '📚 Gerando Livebook'}
            </span>
          </div>
          <Badge 
            variant={livebook.status === 'concluido' ? 'default' : 'secondary'}
            className={
              livebook.status === 'concluido' 
                ? 'bg-green-500' 
                : livebook.status === 'erro'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }
          >
            {getStatusLabel()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações da Palestra */}
        <div className="space-y-2">
          <p className="font-semibold text-foreground">{livebook.palestra.titulo}</p>
          {livebook.palestra.palestrante && (
            <p className="text-sm text-muted-foreground">
              Por: {livebook.palestra.palestrante}
            </p>
          )}
          <Badge variant="outline">
            {livebook.tipo_resumo.replace('_', ' ')}
          </Badge>
        </div>

        {/* Barra de Progresso */}
        {livebook.status !== 'concluido' && livebook.status !== 'erro' && (
          <div className="space-y-2">
            <Progress value={getProgressValue()} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              {getProgressValue()}% completo
            </p>
          </div>
        )}

        {/* Erro */}
        {livebook.status === 'erro' && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-red-900">Erro no processamento</p>
            {livebook.erro_log && (
              <p className="text-sm text-red-800 whitespace-pre-wrap">{livebook.erro_log}</p>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Tentar Novamente
            </Button>
            <p className="text-xs text-red-700 text-center">
              💡 Se o erro persistir, verifique se os arquivos de áudio são públicos no Storage
            </p>
          </div>
        )}

        {/* Downloads - Somente quando concluído */}
        {livebook.status === 'concluido' && (
          <div className="pt-4 border-t space-y-3">
            <p className="text-sm font-medium text-foreground">Baixar Livebook:</p>
            <div className="flex flex-wrap gap-2">
              {livebook.pdf_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(livebook.pdf_url!, `${livebook.palestra.titulo}.pdf`)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              )}
              {livebook.docx_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(livebook.docx_url!, `${livebook.palestra.titulo}.docx`)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Documento Word
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
