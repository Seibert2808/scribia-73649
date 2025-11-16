import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, Loader2, Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder } from '@/components/audio/AudioRecorder';
import { uploadAudioToTranscribe } from '@/lib/audioUpload';

const LivebookForm = () => {
  const { palestraId } = useParams<{ palestraId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useCustomAuth();
  const { toast } = useToast();

  // Estados do formulário
  const [step, setStep] = useState<'audio' | 'processing' | 'completed'>('audio');
  const [palestra, setPalestra] = useState<any>(null);
  const [livebookId, setLivebookId] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loadingPalestra, setLoadingPalestra] = useState(true);
  
  // Estados de processamento
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [livebookData, setLivebookData] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return; // Espera terminar de carregar
    
    if (!user?.profile?.id) {
      console.log("Usuário não autenticado, redirecionando para login");
      navigate('/login');
      return;
    }
    
    if (palestraId) {
      fetchPalestra();
    }
  }, [palestraId, user, authLoading, navigate]);

  const fetchPalestra = async () => {
    if (!user?.profile?.id || !palestraId) return;

    try {
      setLoadingPalestra(true);
      
      // Usar RPC para buscar palestra (bypassa RLS)
      const { data, error } = await supabase.rpc('scribia_get_palestra_for_livebook', {
        p_palestra_id: palestraId!,
        p_usuario_id: user.profile.id
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; data?: any };
      
      if (!result.success) {
        throw new Error(result.error || 'Palestra não encontrada');
      }

      setPalestra(result.data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar palestra",
        description: error.message,
        variant: "destructive"
      });
      navigate(-1);
    } finally {
      setLoadingPalestra(false);
    }
  };

  const handleRecordingComplete = (blob: Blob, duration: number) => {
    setAudioBlob(blob);
    toast({
      title: 'Gravação concluída! 🎙️',
      description: `Duração: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`,
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo de áudio ou vídeo.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'Arquivo muito grande. Máximo: 500MB',
        variant: 'destructive',
      });
      return;
    }

    setAudioFile(file);
    toast({
      title: 'Arquivo selecionado',
      description: file.name,
    });
  };

  const handleProcessAudio = async () => {
    if (!audioBlob && !audioFile) {
      toast({
        title: 'Áudio necessário',
        description: 'Grave ou faça upload de um áudio',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.profile?.id || !palestra) {
      toast({
        title: 'Erro de autenticação',
        description: 'Usuário não autenticado ou palestra não carregada',
        variant: 'destructive',
      });
      return;
    }

    try {
      setStep('processing');
      setUploading(true);
      setProgress(20);

      // Upload do áudio e início da transcrição
      console.log('📤 Enviando áudio para processamento...');
      const audioToUpload = audioFile || new File([audioBlob!], 'recording.webm', { type: 'audio/webm' });
      
      await uploadAudioToTranscribe(
        audioToUpload,
        user.profile.id,
        palestraId!
      );

      setProgress(50);
      console.log('✅ Áudio enviado para transcrição');

      setUploading(false);
      setProcessing(true);

      setProgress(60);
      console.log('✅ Transcrição iniciada');

      // Polling do status
      await pollProcessingStatus();

    } catch (error: any) {
      console.error('❌ Erro no processamento:', error);
      toast({
        title: 'Erro ao processar',
        description: error.message,
        variant: 'destructive',
      });
      setStep('audio');
      setUploading(false);
      setProcessing(false);
    }
  };

  const pollProcessingStatus = async () => {
    let attempts = 0;
    const maxAttempts = 120;

    const checkStatus = async (): Promise<void> => {
      attempts++;
      const progressCalc = 60 + Math.min((attempts / maxAttempts) * 35, 35);
      setProgress(progressCalc);

      // Usar RPC que bypassa RLS
      const { data: statusData, error: statusError } = await supabase.rpc(
        'scribia_poll_palestra_status',
        {
          p_palestra_id: palestraId!,
          p_usuario_id: user?.profile?.id!
        }
      );

      if (statusError) {
        console.error('❌ Erro ao verificar status:', statusError);
        throw new Error('Erro ao verificar status do processamento');
      }

      const result = statusData as any;
      
      if (!result?.success) {
        console.error('❌ RPC retornou erro:', result?.error);
        throw new Error(result?.error || 'Erro ao verificar status');
      }

      const palestraData = result.palestra;
      const livebookData = result.livebook;

      console.log(`🔍 Tentativa ${attempts} - Palestra: ${palestraData?.status}, Livebook: ${livebookData?.status}`);

      // Verificar se a palestra teve erro de transcrição
      if (palestraData?.status === 'erro') {
        setProcessing(false);
        throw new Error(
          palestraData.transcricao || 
          'Erro ao transcrever o áudio. Verifique se o arquivo está acessível e tente novamente.'
        );
      }

      // Verificar se livebook foi concluído
      if (livebookData && livebookData.status === 'concluido') {
        setProgress(100);
        setProcessing(false);
        setLivebookData(livebookData);
        setLivebookId(livebookData.id);
        setStep('completed');
        
        toast({
          title: 'Livebook gerado! 🎉',
          description: 'Seu resumo está pronto para download',
        });
        return;
      }

      // Verificar se livebook teve erro
      if (livebookData && livebookData.status === 'erro') {
        setProcessing(false);
        throw new Error(
          livebookData.erro_log || 
          'Erro ao gerar livebook. Por favor, tente novamente.'
        );
      }

      if (attempts >= maxAttempts) {
        setProcessing(false);
        throw new Error(
          'Tempo limite excedido (6 minutos). O processamento pode estar travado. ' +
          'Verifique se os arquivos de áudio estão públicos no storage. ' +
          'Recarregue a página e tente novamente.'
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
      return checkStatus();
    };

    try {
      await checkStatus();
    } catch (error: any) {
      console.error('❌ Erro no polling:', error);
      toast({
        title: 'Erro no processamento',
        description: error.message,
        variant: 'destructive',
      });
      setStep('audio');
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
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
      
      toast({
        title: 'Download iniciado',
        description: `Baixando ${filename}`,
      });
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast({
        title: 'Erro no download',
        description: 'Tente novamente',
        variant: 'destructive',
      });
    }
  };

  const renderAudioStep = () => (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Áudio</CardTitle>
        <CardDescription>Grave ou faça upload do áudio da palestra</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="record">Gravar</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-4">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex flex-col items-center py-4">
                <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-foreground">
                  {audioFile ? audioFile.name : 'Clique para selecionar'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">MP3, WAV, M4A (máx 500MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/x-m4a,audio/aac,audio/ogg,audio/webm,video/*"
                onChange={handleFileSelect}
              />
            </label>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleProcessAudio}
          disabled={!audioBlob && !audioFile}
          className="w-full"
          size="lg"
        >
          Processar Áudio
        </Button>
      </CardContent>
    </Card>
  );

  const renderProcessingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          Processando Livebook
        </CardTitle>
        <CardDescription>Aguarde enquanto geramos seu resumo personalizado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-4 h-4 ${progress >= 20 ? 'text-green-500' : 'text-muted-foreground'}`} />
            <span>Upload do áudio</span>
          </div>
          <div className="flex items-center gap-2">
            {progress < 60 ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span>Transcrição</span>
          </div>
          <div className="flex items-center gap-2">
            {progress < 100 ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            <span>Geração do livebook</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Este processo pode levar alguns minutos. Não feche esta página.
        </p>
      </CardContent>
    </Card>
  );

  const renderCompletedStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-500" />
          Livebook Gerado com Sucesso!
        </CardTitle>
        <CardDescription>
          Título: {palestra?.titulo}<br />
          Palestrante: {palestra?.palestrante || 'Não informado'}<br />
          Formato: {palestra?.formato_escolhido} | Nível: {palestra?.nivel_escolhido}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {livebookData?.pdf_url && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleDownload(livebookData.pdf_url, `livebook-${palestra?.titulo || 'resumo'}.pdf`)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}

          {livebookData?.docx_url && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleDownload(livebookData.docx_url, `livebook-${palestra?.titulo || 'resumo'}.docx`)}
            >
              <Download className="w-4 h-4 mr-2" />
              Download DOCX
            </Button>
          )}

          {livebookData?.html_url && (
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <a href={livebookData.html_url} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                Visualizar HTML
              </a>
            </Button>
          )}
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="w-full"
        >
          Voltar para Palestra
        </Button>
      </CardContent>
    </Card>
  );

  if (authLoading || loadingPalestra) {
    return (
      <div className="p-4 sm:p-6 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">
              {authLoading ? 'Verificando autenticação...' : 'Carregando palestra...'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!palestra) {
    return (
      <div className="p-4 sm:p-6 py-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Palestra não encontrada</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Palestra
          </Button>
        </div>

        {/* Info da Palestra (Read-only) */}
        <Card>
          <CardHeader>
            <CardTitle>Criar Livebook para: {palestra.titulo}</CardTitle>
            <CardDescription>
              {palestra.palestrante && `Por: ${palestra.palestrante}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Badge variant="outline">
                {palestra.nivel_escolhido === 'junior' && 'Júnior'}
                {palestra.nivel_escolhido === 'pleno' && 'Pleno'}
                {palestra.nivel_escolhido === 'senior' && 'Sênior'}
              </Badge>
              <Badge variant="secondary">
                {palestra.formato_escolhido === 'completo' && 'Completo'}
                {palestra.formato_escolhido === 'compacto' && 'Compacto'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Step: Audio */}
        {step === 'audio' && renderAudioStep()}

        {/* Step: Processing */}
        {step === 'processing' && renderProcessingStep()}

        {/* Step: Completed */}
        {step === 'completed' && renderCompletedStep()}
      </div>
  );
};

export default LivebookForm;