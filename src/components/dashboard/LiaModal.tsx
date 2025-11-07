import React, { useState, useEffect } from 'react';
import { X, Brain, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCustomAuth } from '@/hooks/useCustomAuth';

interface LiaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiaModal: React.FC<LiaModalProps> = ({ isOpen, onClose }) => {
  const { user } = useCustomAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'bia';
    content: string;
    timestamp: Date;
  }>>([]);

  // Verificar se o usuário já interagiu com a Bia nesta sessão
  useEffect(() => {
    if (isOpen && user) {
      const interactionKey = `lia_interaction_${user.profile.id}`;
      const hasInteractedBefore = sessionStorage.getItem(interactionKey);
      setHasInteracted(!!hasInteractedBefore);
    }
  }, [isOpen, user]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // 🔍 DEBUG: Verificar estado da autenticação
      console.log('🔍 DEBUG - Estado da autenticação:', {
        user: user,
        hasInteracted: hasInteracted,
        userProfile: user?.profile,
        userName: user?.profile?.nome_completo,
        userId: user?.profile?.id
      });

      // Preparar histórico da conversa (excluindo a mensagem atual que acabou de ser adicionada)
      const conversationHistory = conversation.map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));

      // Preparar payload base
      const basePayload = {
        message: userMessage.content,
        timestamp: userMessage.timestamp.toISOString(),
        conversation_history: conversationHistory
      };

      // SEMPRE incluir dados do usuário quando disponível (não apenas na primeira interação)
      const payload = user ? {
        ...basePayload,
        user_name: user.profile.nome_completo,
        user_id: user.profile.id,
        is_first_interaction: !hasInteracted
      } : basePayload;

      console.log('📤 Enviando mensagem para Bia:', payload);

      try {
        // Webhook para Bia (usando webhook de produção)
        console.log('🌐 Fazendo requisição para:', 'https://sabrinaseibert.app.n8n.cloud/webhook/scribia_perfil');
        
        const response = await fetch('https://sabrinaseibert.app.n8n.cloud/webhook/scribia_perfil', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        console.log('📡 Resposta do webhook:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Erro do webhook:', errorText);
          throw new Error(`Webhook retornou status ${response.status}: ${response.statusText}. Resposta: ${errorText}`);
        }

        const responseText = await response.text();
        console.log('📄 Texto bruto da resposta:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('✅ Dados JSON parseados:', data);
        } catch (parseError) {
          console.error('❌ Erro ao fazer parse do JSON:', parseError);
          console.log('📄 Resposta não é JSON válido:', responseText);
          throw new Error('Resposta do webhook não é um JSON válido');
        }
        
        // Marcar que o usuário já interagiu
        if (!hasInteracted && user) {
          const interactionKey = `lia_interaction_${user.profile.id}`;
          sessionStorage.setItem(interactionKey, 'true');
          setHasInteracted(true);
        }
        
        // Processar a resposta do n8n que vem como array com objeto contendo 'output'
        let responseContent = 'Desculpe, não consegui processar sua solicitação no momento.';
        
        if (Array.isArray(data) && data.length > 0 && data[0].output) {
          responseContent = data[0].output;
        } else if (data.response) {
          responseContent = data.response;
        } else if (data.output) {
          responseContent = data.output;
        }
        
        const biaResponse = {
          type: 'bia' as const,
          content: responseContent,
          timestamp: new Date()
        };

        setConversation(prev => [...prev, biaResponse]);
      } catch (networkError) {
        console.error('🚫 Erro de rede ou requisição:', networkError);
        throw networkError;
      }
    } catch (error) {
      console.error('Erro ao comunicar com Bia:', error);
      const errorResponse = {
        type: 'bia' as const,
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. O webhook pode não estar ativo no n8n. Tente novamente mais tarde.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6" />
            <div>
              <h2 className="text-xl font-bold">Bia - Agente de Análise de Perfil</h2>
              <p className="text-purple-100 text-sm">Vamos reavaliar seu perfil de aprendizado</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">Olá! Sou a Bia 🧠</h3>
              <p className="mb-4">
                Estou aqui para analisar seu perfil de aprendizado e personalizar seus Livebooks.
              </p>
              <p className="text-sm">
                Conte-me sobre suas preferências, objetivos de aprendizado ou qualquer mudança 
                que gostaria de fazer em seu perfil.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      <span className="text-gray-600">Bia está pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem para a Bia..."
              className="flex-1 min-h-[60px] resize-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiaModal;