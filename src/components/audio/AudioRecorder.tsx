import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // em segundos
}

export const AudioRecorder = ({ onRecordingComplete, maxDuration = 7200 }: AudioRecorderProps) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        stream.getTracks().forEach(track => track.stop());
        
        onRecordingComplete(audioBlob, recordingTimeRef.current);
      };

      mediaRecorder.start(1000); // Coleta dados a cada 1 segundo
      setIsRecording(true);
      setIsPaused(false);

      // Iniciar timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          recordingTimeRef.current = newTime;
          if (newTime >= maxDuration) {
            stopRecording();
            toast({
              title: "Gravação finalizada",
              description: "Tempo máximo de gravação atingido",
            });
          }
          return newTime;
        });
      }, 1000);

      toast({
        title: "Gravação iniciada",
        description: "Fale agora para gravar sua palestra",
      });
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      toast({
        title: "Erro ao gravar",
        description: "Não foi possível acessar o microfone. Verifique as permissões.",
        variant: "destructive",
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        if (timerRef.current === null) {
          timerRef.current = window.setInterval(() => {
            setRecordingTime(prev => {
              const newTime = prev + 1;
              recordingTimeRef.current = newTime;
              return newTime;
            });
          }, 1000);
        }
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const clearRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setRecordingTime(0);
    recordingTimeRef.current = 0;
    setIsPlaying(false);
    audioChunksRef.current = [];
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioURL) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl font-mono text-primary">
          {formatTime(recordingTime)}
        </div>

        {!isRecording && !audioURL && (
          <Button
            onClick={startRecording}
            size="lg"
            className="rounded-full w-16 h-16"
          >
            <Mic className="w-6 h-6" />
          </Button>
        )}

        {isRecording && (
          <div className="flex gap-2">
            <Button
              onClick={pauseRecording}
              variant="outline"
              size="lg"
              className="rounded-full w-16 h-16"
            >
              {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </Button>
            <Button
              onClick={stopRecording}
              variant="destructive"
              size="lg"
              className="rounded-full w-16 h-16"
            >
              <Square className="w-6 h-6" />
            </Button>
          </div>
        )}

        {audioURL && !isRecording && (
          <>
            <audio
              ref={audioRef}
              src={audioURL}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div className="flex gap-2">
              <Button
                onClick={togglePlayback}
                size="lg"
                className="rounded-full w-16 h-16"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              <Button
                onClick={clearRecording}
                variant="outline"
                size="lg"
                className="rounded-full w-16 h-16"
              >
                <Trash2 className="w-6 h-6" />
              </Button>
            </div>
          </>
        )}

        <div className="text-sm text-muted-foreground text-center">
          {!isRecording && !audioURL && "Clique no microfone para iniciar a gravação"}
          {isRecording && !isPaused && "Gravando... Clique em pause para pausar ou stop para finalizar"}
          {isRecording && isPaused && "Gravação pausada. Clique em play para continuar"}
          {audioURL && !isRecording && "Gravação concluída. Reproduza ou exclua para gravar novamente"}
        </div>
      </div>
    </div>
  );
};
