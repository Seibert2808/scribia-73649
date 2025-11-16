import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Upload, Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { uploadAudioToTranscribe, estimateProcessingTime } from '@/lib/audioUpload';

interface AudioUploaderProps {
  palestraId: string;
  onUploadComplete: (transcricao: string) => void;
}

export const AudioUploader = ({ palestraId, onUploadComplete }: AudioUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'transcribing' | 'success' | 'error'>('idle');
  const [estimatedTime, setEstimatedTime] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'upload' | 'transcribe' | 'generate'>('upload');
  const { toast } = useToast();
  const { user } = useCustomAuth();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo de áudio ou vídeo.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'Arquivo muito grande. Máximo: 500MB',
        variant: 'destructive'
      });
      return;
    }

    // Calcular tempo estimado
    const estimate = estimateProcessingTime(file.size);
    setEstimatedTime(estimate);

    await processAudio(file);
  };

  const processAudio = async (file: File) => {
    try {
      setStatus('uploading');
      setUploading(true);
      setUploadProgress(0);
      setCurrentStep('upload');

      if (!user?.profile?.id) throw new Error('Usuário não autenticado');

      console.log('📤 Enviando áudio para processamento...');

      // Upload direto ao Deepgram via streaming
      await uploadAudioToTranscribe(
        file,
        user.profile.id,
        palestraId,
        (progress) => {
          setUploadProgress(progress);
          // Transição suave entre upload e transcrição
          if (progress >= 100) {
            setUploading(false);
            setStatus('transcribing');
            setTranscribing(true);
            setTranscriptionProgress(0);
            setCurrentStep('transcribe');
          }
        }
      );

      toast({
        title: 'Áudio enviado! 🎉',
        description: 'Transcrevendo com Deepgram...'
      });

      console.log('✅ Áudio enviado para transcrição');

      // Polling para verificar o status da transcrição
      let attempts = 0;
      const maxAttempts = 120; // 10 minutos (120 x 5 segundos)
      
      const checkStatus = async (): Promise<boolean> => {
        attempts++;
        
        // Progresso linear baseado em tentativas
        const progress = Math.min((attempts / maxAttempts) * 100, 95);
        setTranscriptionProgress(progress);
        
        // Verificar status da palestra
        const { data: palestraData, error: fetchError } = await supabase
          .rpc('scribia_get_palestra_status', {
            p_palestra_id: palestraId,
            p_usuario_id: user.profile.id
          })
          .maybeSingle();

        if (fetchError) {
          console.error('❌ Erro ao verificar status:', fetchError);
          return false;
        }

        if (!palestraData) {
          console.log('⚠️ Palestra não encontrada');
          await new Promise(resolve => setTimeout(resolve, 5000));
          return checkStatus();
        }

        console.log(`🔍 Tentativa ${attempts}/${maxAttempts} - Status: ${palestraData.status}`);

        // Verificar conclusão
        if ((palestraData.status === 'concluido' || palestraData.status === 'processando') && palestraData.transcricao) {
          setTranscribing(false);
          setTranscriptionProgress(100);
          setCurrentStep('generate');
          setStatus('success');

          toast({
            title: 'Sucesso! ✅',
            description: `Áudio transcrito: ${palestraData.transcricao.length} caracteres`
          });

          onUploadComplete(palestraData.transcricao);
          return true;
        }

        if (palestraData.status === 'erro') {
          throw new Error('Erro na transcrição');
        }

        if (attempts >= maxAttempts) {
          throw new Error('Timeout: verifique em breve o status da transcrição');
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
        return checkStatus();
      };

      await checkStatus();

    } catch (error: any) {
      console.error('❌ Erro no processo:', error);
      setStatus('error');
      setUploading(false);
      setTranscribing(false);

      toast({
        title: 'Erro no processamento',
        description: error.message || 'Erro ao processar áudio',
        variant: 'destructive'
      });
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {currentStep === 'upload' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
              {(currentStep === 'transcribe' || currentStep === 'generate') && <CheckCircle className="w-5 h-5 text-green-500" />}
              <span className="text-sm">1. Upload do áudio</span>
            </div>
            <Progress value={uploadProgress} className="w-full h-2" />
            {estimatedTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Tempo estimado: {estimatedTime}</span>
              </div>
            )}
          </div>
        );

      case 'transcribing':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm">1. Upload do áudio</span>
            </div>
            <div className="flex items-center gap-2">
              {currentStep === 'transcribe' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
              {currentStep === 'generate' && <CheckCircle className="w-5 h-5 text-green-500" />}
              <span className="text-sm">2. Transcrição (Deepgram)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              {currentStep === 'generate' && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
              <span className="text-sm">3. Geração do Livebook (IA)</span>
            </div>
            <Progress value={transcriptionProgress} className="w-full h-2" />
            {estimatedTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <Clock className="w-3 h-3" />
                <span>Tempo estimado: {estimatedTime}</span>
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <>
            <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
            <p className="text-sm font-medium text-green-700">Transcrição concluída!</p>
          </>
        );

      case 'error':
        return (
          <>
            <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
            <p className="text-sm font-medium text-red-700">Erro ao processar</p>
            <Button 
              onClick={() => setStatus('idle')} 
              variant="outline" 
              size="sm"
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </>
        );

      default:
        return (
          <>
            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-foreground">Clique para fazer upload</p>
            <p className="text-xs text-muted-foreground mt-1">MP3, WAV, M4A (máx 500MB)</p>
          </>
        );
    }
  };

  return (
    <label className={`
      flex flex-col items-center justify-center w-full h-40 
      border-2 border-dashed rounded-lg 
      ${status === 'idle' ? 'cursor-pointer hover:bg-muted/50' : ''}
      ${status === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
      ${status === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950' : ''}
      ${status === 'uploading' || status === 'transcribing' ? 'border-blue-500' : 'border-border'}
      transition-colors
    `}>
      <div className="flex flex-col items-center py-4">
        {renderStatus()}
      </div>
      <input
        type="file"
        className="hidden"
        accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/x-m4a,audio/aac,audio/ogg,audio/webm,video/*"
        onChange={handleFileSelect}
        disabled={uploading || transcribing}
      />
    </label>
  );
};
