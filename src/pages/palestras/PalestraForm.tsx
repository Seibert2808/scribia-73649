import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import PageLayout from "@/components/dashboard/PageLayout";
import {
  NivelConhecimento,
  FormatoPalestra,
  OrigemClassificacao,
  StatusPalestra,
  PersonalizacaoResponse,
  getWebhookDestino,
  WEBHOOK_URLS,
} from "@/types/palestra";

const PalestraForm = () => {
  const { eventoId, palestraId } = useParams<{ eventoId: string; palestraId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const isEditing = !!palestraId;

  const [formData, setFormData] = useState({
    titulo: "",
    palestrante: "",
    tags_tema: [] as string[],
    nivel_escolhido: null as NivelConhecimento | null,
    formato_escolhido: null as FormatoPalestra | null,
    origem_classificacao: "manual" as OrigemClassificacao,
  });

  const [currentTag, setCurrentTag] = useState("");
  const [step, setStep] = useState<"basic" | "nivel" | "formato" | "upload">("basic");
  const [loading, setLoading] = useState(false);
  const [personalizacaoSugerida, setPersonalizacaoSugerida] = useState<PersonalizacaoResponse | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [slidesFile, setSlidesFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ audio: 0, slides: 0 });

  useEffect(() => {
    if (isEditing && palestraId) {
      fetchPalestra();
    }
  }, [isEditing, palestraId]);

  const fetchPalestra = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("scribia_palestras")
        .select("*")
        .eq("id", palestraId!)
        .single();

      if (error) throw error;

      setFormData({
        titulo: data.titulo,
        palestrante: data.palestrante || "",
        tags_tema: data.tags_tema || [],
        nivel_escolhido: data.nivel_escolhido,
        formato_escolhido: data.formato_escolhido,
        origem_classificacao: data.origem_classificacao,
      });

      // Se já tem nível e formato, ir para upload
      if (data.nivel_escolhido && data.formato_escolhido) {
        setStep("upload");
      }
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

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags_tema.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags_tema: [...formData.tags_tema, currentTag.trim()],
      });
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
      toast({
        title: "Campo obrigatório",
        description: "O título da palestra é obrigatório.",
        variant: "destructive",
      });
      return;
    }
    setStep("nivel");
  };

  const handleSolicitarPersonalizacao = async () => {
    try {
      setLoading(true);

      const response = await fetch(WEBHOOK_URLS.personalizacao, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formData.titulo,
          palestrante: formData.palestrante,
          tags_tema: formData.tags_tema,
        }),
      });

      if (!response.ok) throw new Error("Erro ao solicitar personalização");

      const data: PersonalizacaoResponse = await response.json();
      setPersonalizacaoSugerida(data);

      toast({
        title: "✨ Análise concluída!",
        description: `Sugerimos o nível ${data.nivel_sugerido.toUpperCase()} (confiança: ${Math.round(data.confidence * 100)}%)`,
      });
    } catch (error: any) {
      toast({
        title: "Erro na personalização",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNivelSubmit = () => {
    if (!formData.nivel_escolhido) {
      toast({
        title: "Escolha um nível",
        description: "Selecione o nível de conhecimento do público.",
        variant: "destructive",
      });
      return;
    }
    setStep("formato");
  };

  const handleFormatoSubmit = () => {
    if (!formData.formato_escolhido) {
      toast({
        title: "Escolha um formato",
        description: "Selecione o formato desejado para o conteúdo.",
        variant: "destructive",
      });
      return;
    }
    setStep("upload");
  };

  const handleFileUpload = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user!.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);

      let audioUrl: string | null = null;
      let slidesUrl: string | null = null;

      // Upload de arquivos
      if (audioFile) {
        setUploadProgress({ ...uploadProgress, audio: 50 });
        audioUrl = await handleFileUpload(audioFile, "scribia-audio", eventoId!);
        setUploadProgress({ ...uploadProgress, audio: 100 });
      }

      if (slidesFile) {
        setUploadProgress({ ...uploadProgress, slides: 50 });
        slidesUrl = await handleFileUpload(slidesFile, "scribia-slides", eventoId!);
        setUploadProgress({ ...uploadProgress, slides: 100 });
      }

      const webhookDestino = getWebhookDestino(
        formData.nivel_escolhido!,
        formData.formato_escolhido!
      );

      const palestraData = {
        evento_id: eventoId!,
        usuario_id: user!.id,
        titulo: formData.titulo,
        palestrante: formData.palestrante || null,
        tags_tema: formData.tags_tema.length > 0 ? formData.tags_tema : null,
        nivel_escolhido: formData.nivel_escolhido,
        formato_escolhido: formData.formato_escolhido,
        origem_classificacao: formData.origem_classificacao,
        confidence: personalizacaoSugerida?.confidence || null,
        webhook_destino: webhookDestino,
        status: (audioUrl ? "processando" : "aguardando") as StatusPalestra,
        audio_url: audioUrl,
        slides_url: slidesUrl,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("scribia_palestras")
          .update(palestraData)
          .eq("id", palestraId!);

        if (error) throw error;

        toast({
          title: "✅ Palestra atualizada!",
        });
      } else {
        const { error } = await supabase
          .from("scribia_palestras")
          .insert(palestraData);

        if (error) throw error;

        toast({
          title: "✅ Palestra criada com sucesso!",
        });
      }

      // Se houver áudio, iniciar transcrição via edge function
      if (audioUrl) {
        const { data: newPalestra } = await supabase
          .from("scribia_palestras")
          .select("id")
          .eq("usuario_id", user!.id)
          .order("criado_em", { ascending: false })
          .limit(1)
          .single();

        const palestraIdForTranscription = isEditing ? palestraId : newPalestra?.id;

        if (palestraIdForTranscription) {
          // Call transcription edge function
          const { error: transcribeError } = await supabase.functions.invoke('scribia-transcribe', {
            body: {
              palestra_id: palestraIdForTranscription,
              audio_url: audioUrl,
            }
          });

          if (transcribeError) {
            console.error("Erro ao iniciar transcrição:", transcribeError);
            toast({
              title: "⚠️ Aviso",
              description: "Palestra salva, mas a transcrição não pôde ser iniciada.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "🎙️ Transcrição iniciada!",
              description: "O processamento do áudio foi iniciado. Você pode acompanhar o progresso na aba Livebooks.",
            });
          }
        }
      }

      navigate(`/eventos/${eventoId}/palestras`);
    } catch (error: any) {
      toast({
        title: "Erro ao salvar palestra",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(`/eventos/${eventoId}/palestras`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Palestras
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Editar Palestra" : "Nova Palestra"}</CardTitle>
            <CardDescription>
              {step === "basic" && "Preencha as informações básicas"}
              {step === "nivel" && "Defina o nível de conhecimento do público"}
              {step === "formato" && "Escolha o formato do conteúdo"}
              {step === "upload" && "Faça upload dos materiais"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Informações Básicas */}
            {step === "basic" && (
              <div className="space-y-4">
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
                      placeholder="Digite uma tag e pressione Enter"
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

                <Button onClick={handleBasicInfoSubmit} className="w-full">
                  Continuar
                </Button>
              </div>
            )}

            {/* Step 2: Nível */}
            {step === "nivel" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Como deseja definir o nível?</Label>
                  <RadioGroup
                    value={formData.origem_classificacao}
                    onValueChange={(value) =>
                      setFormData({ ...formData, origem_classificacao: value as OrigemClassificacao })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manual" id="manual" />
                      <Label htmlFor="manual">Escolher manualmente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" />
                      <Label htmlFor="auto">Solicitar sugestão automática (IA)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.origem_classificacao === "auto" && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleSolicitarPersonalizacao}
                      disabled={loading}
                      className="w-full"
                      variant="outline"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                      )}
                      Analisar com IA
                    </Button>

                    {personalizacaoSugerida && (
                      <Card className="bg-muted">
                        <CardContent className="pt-4">
                          <p className="text-sm font-medium mb-2">Sugestão da IA:</p>
                          <div className="space-y-2">
                            <Badge variant="default">
                              {personalizacaoSugerida.nivel_sugerido.toUpperCase()}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              Confiança: {Math.round(personalizacaoSugerida.confidence * 100)}%
                            </p>
                            {personalizacaoSugerida.justificativa && (
                              <p className="text-sm">{personalizacaoSugerida.justificativa}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Label>Nível de Conhecimento do Público</Label>
                  <RadioGroup
                    value={formData.nivel_escolhido || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, nivel_escolhido: value as NivelConhecimento })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="junior" id="junior" />
                      <Label htmlFor="junior">Júnior - Iniciante no tema</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pleno" id="pleno" />
                      <Label htmlFor="pleno">Pleno - Conhecimento intermediário</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="senior" id="senior" />
                      <Label htmlFor="senior">Sênior - Conhecimento avançado</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("basic")} className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handleNivelSubmit} className="flex-1">
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Formato */}
            {step === "formato" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>Formato do Conteúdo</Label>
                  <p className="text-sm text-muted-foreground">
                    Você prefere textos mais longos e aprofundados ou uma versão resumida?
                  </p>
                  <RadioGroup
                    value={formData.formato_escolhido || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, formato_escolhido: value as FormatoPalestra })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="completo" id="completo" />
                      <Label htmlFor="completo">Completo - Textos longos e aprofundados</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="compacto" id="compacto" />
                      <Label htmlFor="compacto">Compacto - Versão resumida e direta</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("nivel")} className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handleFormatoSubmit} className="flex-1">
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Upload */}
            {step === "upload" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audio">Upload de Áudio (mp3, m4a, wav)</Label>
                  <Input
                    id="audio"
                    type="file"
                    accept="audio/mp3,audio/m4a,audio/wav"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  />
                  {uploadProgress.audio > 0 && uploadProgress.audio < 100 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Progresso: {uploadProgress.audio}%
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="slides">Upload de Slides (PDF) - Opcional</Label>
                  <Input
                    id="slides"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setSlidesFile(e.target.files?.[0] || null)}
                  />
                  {uploadProgress.slides > 0 && uploadProgress.slides < 100 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Progresso: {uploadProgress.slides}%
                    </p>
                  )}
                </div>

                <Card className="bg-muted">
                  <CardContent className="pt-4">
                    <p className="text-sm font-medium mb-2">Resumo:</p>
                    <div className="space-y-1 text-sm">
                      <p>Nível: <Badge>{formData.nivel_escolhido}</Badge></p>
                      <p>Formato: <Badge>{formData.formato_escolhido}</Badge></p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Webhook: {getWebhookDestino(formData.nivel_escolhido!, formData.formato_escolhido!)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("formato")} className="flex-1">
                    Voltar
                  </Button>
                  <Button onClick={handleFinalSubmit} disabled={loading} className="flex-1">
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {isEditing ? "Atualizar" : "Criar"} Palestra
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PalestraForm;
