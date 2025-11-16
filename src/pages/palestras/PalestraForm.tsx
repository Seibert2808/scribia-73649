import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, CheckCircle, Download, FileText, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AudioUploader } from "@/components/audio/AudioUploader";
import {
  NivelConhecimento,
  FormatoPalestra,
  getWebhookDestino,
} from "@/types/palestra";

const PalestraForm = () => {
  const { eventoId } = useParams<{ eventoId: string }>();
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();

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

  const [formData, setFormData] = useState({
    titulo: "",
    palestrante: "",
    tags_tema: [] as string[],
    nivel_escolhido: null as NivelConhecimento | null,
    formato_escolhido: null as FormatoPalestra | null,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [step, setStep] = useState<"basic" | "perfil" | "upload" | "completed">("basic");
  const [uploadMode, setUploadMode] = useState<'audio' | 'text'>('audio');
  const [palestraId, setPalestraId] = useState<string | null>(null);
  const [preparingUpload, setPreparingUpload] = useState(false);
  const [transcricao, setTranscricao] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [livebookData, setLivebookData] = useState<any>(null);
  const [livebookContent, setLivebookContent] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Helper functions para formatação
  const formatNivel = (nivel: string | null): string => {
    const niveis: Record<string, string> = {
      'junior': 'Júnior',
      'pleno': 'Pleno',
      'senior': 'Sênior'
    };
    return nivel ? niveis[nivel] || nivel : '-';
  };

  const formatFormato = (formato: string | null): string => {
    const formatos: Record<string, string> = {
      'completo': 'Completo',
      'compacto': 'Compacto'
    };
    return formato ? formatos[formato] || formato : '-';
  };

  const getNivelVariant = (nivel: string | null): "default" | "secondary" | "destructive" | "outline" => {
    if (nivel === 'junior') return 'secondary';
    if (nivel === 'pleno') return 'default';
    if (nivel === 'senior') return 'destructive';
    return 'outline';
  };

  const handleAddTag = () => {
    if (currentTag.trim()) {
      const newTags = currentTag
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0 && !formData.tags_tema.includes(tag));
      
      if (newTags.length > 0) {
        setFormData({
          ...formData,
          tags_tema: [...formData.tags_tema, ...newTags],
        });
      }
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags_tema: formData.tags_tema.filter((t) => t !== tag),
    });
  };

  const handleBasicInfoSubmit = () => {
    if (!formData.titulo.trim()) {
      toastHook({
        title: "Campo obrigatório",
        description: "O título da palestra é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    setStep("perfil");
  };

  const handlePerfilSubmit = () => {
    if (!formData.nivel_escolhido) {
      toastHook({
        title: "Escolha um nível",
        description: "Selecione o nível de conhecimento do público.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.formato_escolhido) {
      toastHook({
        title: "Escolha um formato",
        description: "Selecione o formato desejado para o conteúdo.",
        variant: "destructive",
      });
      return;
    }
    setStep("upload");
  };

  // Criar palestra
  const criarPalestra = async () => {
    try {
      const userId = localStorage.getItem('scribia_user_id');
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }
      
      const webhookDestino = getWebhookDestino(
        formData.nivel_escolhido!,
        formData.formato_escolhido!
      );

      const { data, error } = await supabase.rpc('scribia_create_palestra' as any, {
        p_usuario_id: userId,
        p_evento_id: eventoId,
        p_titulo: formData.titulo,
        p_palestrante: formData.palestrante || null,
        p_tags_tema: formData.tags_tema.length > 0 ? formData.tags_tema : null,
        p_nivel_escolhido: formData.nivel_escolhido,
        p_formato_escolhido: formData.formato_escolhido,
        p_origem_classificacao: "manual",
        p_confidence: null,
        p_webhook_destino: webhookDestino,
        p_status: 'aguardando',
        p_audio_urls: null,
        p_slides_url: null,
      });
      
      if (error) throw error;
      if (!(data as any)?.success) {
        throw new Error((data as any)?.error || 'Erro ao criar palestra');
      }
      
      const palestraIdNovo = (data as any).palestra_id;
      setPalestraId(palestraIdNovo);
      
      toastHook({
        title: 'Preparado para upload! ✅',
        description: 'Agora você pode fazer upload do áudio'
      });
      
      return palestraIdNovo;
    } catch (error: any) {
      console.error('Erro ao criar palestra:', error);
      toastHook({
        title: 'Erro',
        description: error.message || 'Não foi possível criar a palestra',
        variant: 'destructive'
      });
      return null;
    }
  };

  // Preparar upload de áudio
  const handlePrepareAudioUpload = async () => {
    if (!formData.titulo.trim()) {
      toastHook({
        title: "Erro",
        description: "Por favor, preencha o título antes de continuar",
        variant: "destructive"
      });
      return;
    }

    setPreparingUpload(true);
    const palestraIdNovo = await criarPalestra();
    setPreparingUpload(false);

    if (!palestraIdNovo) {
      toastHook({
        title: "Erro",
        description: "Não foi possível criar registro da palestra",
        variant: "destructive"
      });
    }
  };

  // Callback após transcrição concluída
  const handleAudioUploadComplete = async (texto: string) => {
    setTranscricao(texto);
    toastHook({
      title: 'Transcrição concluída! ✅',
      description: 'Gerando o Livebook automaticamente...'
    });

    // Gerar livebook automaticamente após transcrição
    setProcessing(true);
    setProgress(60);
    await pollProcessingStatus(palestraId!);
  };

  // Upload de arquivo de texto
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setTranscricao(event.target?.result as string);
        toastHook({
          title: "Arquivo carregado",
          description: `${file.name} foi carregado com sucesso`
        });
      };
      reader.readAsText(file);
    }
  };

  // Gerar livebook a partir de texto
  const handleGenerateFromText = async () => {
    if (!formData.titulo.trim()) {
      toastHook({
        title: "Erro",
        description: "Por favor, preencha o título do livebook",
        variant: "destructive"
      });
      return;
    }
    
    if (!transcricao.trim()) {
      toastHook({
        title: "Erro",
        description: "Por favor, insira ou faça upload da transcrição",
        variant: "destructive"
      });
      return;
    }

    // Criar palestra se não existir
    let currentPalestraId = palestraId;
    if (!currentPalestraId) {
      currentPalestraId = await criarPalestra();
      if (!currentPalestraId) {
        toastHook({
          title: "Erro",
          description: "Não foi possível criar registro da palestra",
          variant: "destructive"
        });
        return;
      }
    }

    setIsGenerating(true);
    setProcessing(true);
    setProgress(30);

    try {
      const userId = localStorage.getItem('scribia_user_id');
      const perfil = `${formData.nivel_escolhido}-${formData.formato_escolhido}`;
      
      const metadados = {
        titulo: formData.titulo || undefined,
        palestrante: formData.palestrante || undefined
      };
      
      const { data, error } = await supabase.functions.invoke('generate-livebook', {
        body: {
          transcricao: transcricao,
          perfil: perfil,
          metadados,
          palestraId: currentPalestraId,
          usuarioId: userId
        }
      });
      
      if (error) throw error;
      if (data?.error) {
        throw new Error(data.error);
      }

      setProgress(90);
      
      // Aguardar um pouco e depois verificar status
      await new Promise(resolve => setTimeout(resolve, 2000));
      await pollProcessingStatus(currentPalestraId);

    } catch (error: any) {
      console.error('Erro ao gerar Livebook:', error);
      toastHook({
        title: "Erro ao gerar Livebook",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
      setIsGenerating(false);
      setProcessing(false);
    }
  };

  const pollProcessingStatus = async (palestraIdToCheck: string) => {
    console.log(`🚀 Iniciando polling via RPC para palestra: ${palestraIdToCheck}`);
    let attempts = 0;
    const maxAttempts = 120;

    const checkStatus = async (): Promise<void> => {
      attempts++;
      const progressCalc = 60 + Math.min((attempts / maxAttempts) * 35, 35);
      setProgress(progressCalc);

      const userId = localStorage.getItem('scribia_user_id');
      const { data, error } = await supabase.rpc('scribia_poll_palestra_status', {
        p_palestra_id: palestraIdToCheck,
        p_usuario_id: userId
      });

      console.log(`🔍 Tentativa ${attempts}/${maxAttempts}`, { data, error });

      if (error) {
        console.error('❌ Erro RPC:', error);
        setTimeout(checkStatus, 3000);
        return;
      }

      const result = data as { success: boolean; error?: string; palestra?: { status: string; transcricao?: string }; livebook?: { id: string; status: string; pdf_url?: string; docx_url?: string; html_url?: string; erro_log?: string } };

      if (!result?.success) {
        console.error('❌ Erro da função:', result?.error);
        setProcessing(false);
        setIsGenerating(false);
        toastHook({
          title: 'Erro ao buscar status',
          description: result?.error || 'Erro desconhecido',
          variant: 'destructive'
        });
        return;
      }

      const { palestra: palestraData, livebook: livebookData } = result;

      if (palestraData?.status === 'erro') {
        setProcessing(false);
        setIsGenerating(false);
        toastHook({
          title: 'Erro na transcrição',
          description: palestraData.transcricao || 'Erro ao transcrever áudio',
          variant: 'destructive'
        });
        return;
      }

      if (livebookData && livebookData.status === 'concluido') {
        setProgress(100);
        setProcessing(false);
        setIsGenerating(false);
        setLivebookData(livebookData);
        
        await fetchLivebookContent(livebookData);
        
        setStep('completed');
        toastHook({
          title: 'Livebook gerado! 🎉',
          description: 'Seu resumo está pronto',
        });
        return;
      }

      if (livebookData && livebookData.status === 'erro') {
        setProcessing(false);
        setIsGenerating(false);
        toastHook({
          title: 'Erro ao gerar livebook',
          description: livebookData.erro_log || 'Erro desconhecido',
          variant: 'destructive'
        });
        return;
      }

      if (attempts >= maxAttempts) {
        setProcessing(false);
        setIsGenerating(false);
        toastHook({
          title: 'Tempo limite excedido',
          description: 'O processamento está demorando mais que o esperado.',
          variant: 'destructive'
        });
        return;
      }

      setTimeout(checkStatus, 3000);
    };

    checkStatus();
  };

  const fetchLivebookContent = async (livebook: any) => {
    try {
      if (livebook.html_url) {
        const response = await fetch(livebook.html_url);
        if (response.ok) {
          const content = await response.text();
          setLivebookContent(content);
          return;
        }
      }

      setLivebookContent(`# ${formData.titulo}\n\n**Palestrante:** ${formData.palestrante || 'Não informado'}\n\nLivebook gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      setLivebookContent('Livebook gerado com sucesso! Use os botões abaixo para fazer download.');
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/dashboard/eventos/${eventoId}/palestras`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Palestras
        </Button>

        {/* Step 1: Informações Básicas */}
        {step === "basic" && (
          <Card>
            <CardHeader>
              <CardTitle>Nova Palestra</CardTitle>
              <CardDescription>Preencha as informações básicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título da Palestra *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Introdução ao React"
                />
              </div>

              <div>
                <Label htmlFor="palestrante">Nome do Palestrante</Label>
                <Input
                  id="palestrante"
                  value={formData.palestrante}
                  onChange={(e) => setFormData({ ...formData, palestrante: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags/Temas</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Digite tags separadas por vírgula (ex: react, javascript, frontend)"
                  />
                  <Button type="button" onClick={handleAddTag}>
                    Adicionar
                  </Button>
                </div>
                {formData.tags_tema.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags_tema.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleBasicInfoSubmit} 
                className="w-full"
              >
                Continuar
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Perfil (Nível + Formato) */}
        {step === "perfil" && (
          <Card>
            <CardHeader>
              <CardTitle>Defina o Perfil do Livebook</CardTitle>
              <CardDescription>Escolha o nível e formato do conteúdo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nível de Conhecimento */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Qual o seu nivel de conhecimento do assunto?</Label>
                <RadioGroup
                  value={formData.nivel_escolhido || ""}
                  onValueChange={(value) => {
                    setFormData({ 
                      ...formData, 
                      nivel_escolhido: value as NivelConhecimento,
                    });
                  }}
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="junior" id="junior" />
                    <Label htmlFor="junior" className="cursor-pointer flex-1">
                      <span className="font-medium">🌱 Júnior</span>
                      <p className="text-xs text-muted-foreground">Iniciante no tema</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="pleno" id="pleno" />
                    <Label htmlFor="pleno" className="cursor-pointer flex-1">
                      <span className="font-medium">🎯 Pleno</span>
                      <p className="text-xs text-muted-foreground">Conhecimento intermediário</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="senior" id="senior" />
                    <Label htmlFor="senior" className="cursor-pointer flex-1">
                      <span className="font-medium">🚀 Sênior</span>
                      <p className="text-xs text-muted-foreground">Conhecimento avançado</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Formato do Conteúdo */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Como você prefere o seu Livebook?</Label>
                <p className="text-sm text-muted-foreground">
                  Você prefere textos mais longos e aprofundados ou uma versão resumida?
                </p>
                <RadioGroup
                  value={formData.formato_escolhido || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, formato_escolhido: value as FormatoPalestra })
                  }
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="completo" id="completo" />
                    <Label htmlFor="completo" className="cursor-pointer flex-1">
                      <span className="font-medium">📚 Completo</span>
                      <p className="text-xs text-muted-foreground">Textos longos e aprofundados</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="compacto" id="compacto" />
                    <Label htmlFor="compacto" className="cursor-pointer flex-1">
                      <span className="font-medium">⚡ Compacto</span>
                      <p className="text-xs text-muted-foreground">Versão resumida e direta</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("basic")} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handlePerfilSubmit} className="flex-1">
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload - Layout 2 colunas similar ao GerarLivebook */}
        {step === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Coluna Esquerda: Inputs */}
            <div className="space-y-6">
              {/* Card com informações readonly */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Informações do Livebook
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Título</Label>
                    <p className="font-medium">{formData.titulo}</p>
                  </div>
                  {formData.palestrante && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Palestrante</Label>
                      <p className="font-medium">{formData.palestrante}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-2">
                    <Badge variant={getNivelVariant(formData.nivel_escolhido)}>
                      {formatNivel(formData.nivel_escolhido)}
                    </Badge>
                    <Badge variant="outline">
                      {formatFormato(formData.formato_escolhido)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Card com Tabs de Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo da Palestra</CardTitle>
                  <CardDescription>
                    Escolha como deseja fornecer o conteúdo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as 'audio' | 'text')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="audio">Upload de Áudio</TabsTrigger>
                      <TabsTrigger value="text">Transcrição Manual</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="audio" className="space-y-4">
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                          <h4 className="font-medium text-sm">📝 Como funciona:</h4>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Clique em "Iniciar Upload de Áudio"</li>
                            <li>Selecione o arquivo de áudio da palestra</li>
                            <li>Aguarde a transcrição automática</li>
                            <li>Seu Livebook será gerado automaticamente</li>
                          </ol>
                        </div>

                        {!palestraId ? (
                          <Button 
                            onClick={handlePrepareAudioUpload}
                            disabled={preparingUpload}
                            className="w-full"
                          >
                            {preparingUpload ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Preparando...
                              </>
                            ) : (
                              'Iniciar Upload de Áudio'
                            )}
                          </Button>
                        ) : (
                          <AudioUploader
                            palestraId={palestraId}
                            onUploadComplete={handleAudioUploadComplete}
                          />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="text" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="textFile" className="text-sm">
                            Ou faça upload de arquivo .txt
                          </Label>
                          <Input
                            id="textFile"
                            type="file"
                            accept=".txt"
                            onChange={handleFileUpload}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="transcricao">Cole ou digite a transcrição</Label>
                          <Textarea
                            id="transcricao"
                            value={transcricao}
                            onChange={(e) => setTranscricao(e.target.value)}
                            placeholder="Cole aqui a transcrição da palestra..."
                            className="min-h-[200px] mt-2"
                          />
                        </div>

                        <Button 
                          onClick={handleGenerateFromText}
                          disabled={isGenerating || !transcricao.trim()}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Gerando Livebook...
                            </>
                          ) : (
                            'Gerar Livebook'
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Button 
                variant="outline" 
                onClick={() => setStep("perfil")}
                className="w-full"
              >
                Voltar
              </Button>
            </div>

            {/* Coluna Direita: Output/Status */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Livebook Gerado</CardTitle>
                  <CardDescription>
                    {processing ? 'Processando seu conteúdo...' : 'Aguardando processamento'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {processing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-sm font-medium">Gerando seu Livebook...</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-sm text-muted-foreground space-y-2">
                        <p>📝 Transcrevendo áudio com IA...</p>
                        <p>📚 Gerando Livebook personalizado...</p>
                        <p className="text-xs">
                          Isso pode levar alguns minutos dependendo do tamanho do áudio.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-sm">Seu Livebook aparecerá aqui após o processamento</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* View Completed */}
        {step === "completed" && livebookData && (
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" />
                  Livebook Gerado com Sucesso!
                </CardTitle>
                <CardDescription>
                  <strong>{formData.titulo}</strong>
                  {formData.palestrante && <><br />Palestrante: {formData.palestrante}</>}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {livebookData.pdf_url && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(livebookData.pdf_url, `${formData.titulo}.pdf`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                )}
                {livebookData.docx_url && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleDownload(livebookData.docx_url, `${formData.titulo}.docx`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download DOCX
                  </Button>
                )}
                {livebookData.html_url && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(livebookData.html_url, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver HTML
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📖 Preview do Livebook</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none bg-muted/50 rounded-lg p-6 border max-h-[600px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {livebookContent || 'Carregando conteúdo...'}
                  </pre>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/dashboard/eventos/${eventoId}/palestras`)}
                className="flex-1"
              >
                Ver Todas as Palestras
              </Button>
              <Button 
                onClick={() => {
                  setStep('basic');
                  setFormData({
                    titulo: "",
                    palestrante: "",
                    tags_tema: [],
                    nivel_escolhido: null,
                    formato_escolhido: null,
                  });
                  setTranscricao('');
                  setLivebookData(null);
                  setLivebookContent('');
                  setPalestraId(null);
                }}
                className="flex-1"
              >
                Criar Nova Palestra
              </Button>
            </div>
          </div>
        )}
      </div>
  );
};

export default PalestraForm;
