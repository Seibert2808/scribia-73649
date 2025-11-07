import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { TutorMessage } from "./TutorMessage";
import { TutorInput } from "./TutorInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Trash2, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface Message {
  id: string;
  type: "user" | "tutor";
  message: string;
  timestamp: Date;
}

const WEBHOOK_URL = "https://sabrinaseibert.app.n8n.cloud/webhook/tutor_scribia";

function TutorChatContent() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const loadHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("scribia_tutor_sessions")
        .select("*")
        .eq("usuario_id", user.id)
        .order("criado_em", { ascending: true })
        .limit(20);

      if (error) throw error;

      const historyMessages: Message[] = [];
      data?.forEach((session) => {
        historyMessages.push({
          id: `${session.id}-user`,
          type: "user",
          message: session.pergunta,
          timestamp: new Date(session.criado_em),
        });
        historyMessages.push({
          id: `${session.id}-tutor`,
          type: "tutor",
          message: session.resposta,
          timestamp: new Date(session.criado_em),
        });
      });

      setMessages(historyMessages);
    } catch (error) {
      console.error("Error loading history:", error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de conversas.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("scribia_tutor_sessions")
        .delete()
        .eq("usuario_id", user.id);

      if (error) throw error;

      setMessages([]);
      toast({
        title: "Histórico limpo",
        description: "Todas as conversas foram excluídas.",
      });
    } catch (error) {
      console.error("Error clearing history:", error);
      toast({
        title: "Erro ao limpar histórico",
        description: "Não foi possível limpar o histórico.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!user || !profile) return;

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-user-${Date.now()}`,
      type: "user",
      message: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get user's livebooks for context
      const { data: livebooks, error: livebooksError } = await supabase
        .from("scribia_livebooks")
        .select(`
          id,
          tipo_resumo,
          pdf_url,
          html_url,
          status,
          palestra:scribia_palestras(titulo, palestrante)
        `)
        .eq("usuario_id", user.id)
        .eq("status", "concluido");

      if (livebooksError) throw livebooksError;

      // Send to n8n webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            id: user.id,
            email: profile?.email || "",
          },
          query: messageText,
          context: livebooks || [],
          limit: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao obter resposta do Tutor");
      }

      const data = await response.json();
      const tutorResponse = data.resposta || data.response || "Desculpe, não consegui processar sua pergunta.";

      // Add tutor message
      const tutorMessage: Message = {
        id: `temp-tutor-${Date.now()}`,
        type: "tutor",
        message: tutorResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, tutorMessage]);

      // Save to database
      const { error: insertError } = await supabase
        .from("scribia_tutor_sessions")
        .insert({
          usuario_id: user.id,
          pergunta: messageText,
          resposta: tutorResponse,
        });

      if (insertError) {
        console.error("Error saving session:", insertError);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Não foi possível obter resposta do Tutor. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-accent/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 p-4 md:p-8">
      <div className="container max-w-4xl mx-auto">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Tutor ScribIA</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Pergunte sobre seus Livebooks
                  </p>
                </div>
              </div>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar histórico
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <ScrollArea ref={scrollAreaRef} className="h-[500px] p-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Bot className="h-16 w-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">
                    Olá! Sou o Tutor ScribIA
                  </p>
                  <p className="text-sm">
                    Faça perguntas sobre os conteúdos dos seus Livebooks e eu vou te ajudar!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <TutorMessage
                      key={msg.id}
                      type={msg.type}
                      message={msg.message}
                      timestamp={msg.timestamp}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-2xl rounded-tl-none">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Pensando...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            <div className="p-6 border-t">
              <TutorInput onSend={sendMessage} disabled={isLoading} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TutorChat() {
  return (
    <AuthGuard>
      <TutorChatContent />
    </AuthGuard>
  );
}
