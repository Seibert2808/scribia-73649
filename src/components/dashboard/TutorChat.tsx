import React, { useState } from 'react';
import { X, MessageCircle, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TutorChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorChat: React.FC<TutorChatProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'tutor';
    content: string;
    timestamp: Date;
  }>>([]);

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
      // Webhook para Tutor ScribIA
      const response = await fetch('https://sabrinaseibert.app.n8n.cloud/webhook/tutor_scribia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: userMessage.timestamp.toISOString()
        })
      });

      const data = await response.json();
      
      const tutorResponse = {
        type: 'tutor' as const,
        content: data.response || 'Desculpe, não consegui processar sua pergunta no momento.',
        timestamp: new Date()
      };

      setConversation(prev => [...prev, tutorResponse]);
    } catch (error) {
      console.error('Erro ao comunicar com Tutor:', error);
      const errorResponse = {
        type: 'tutor' as const,
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 flex flex-col border-l">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Tutor ScribIA</h3>
            <p className="text-xs text-blue-100">Assistente de Aprendizado</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {conversation.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Bot className="h-10 w-10 mx-auto mb-3 text-blue-400" />
            <h4 className="font-semibold mb-2">Olá! Sou o Tutor ScribIA 💬</h4>
            <p className="text-sm mb-3">
              Estou aqui para ajudar com dúvidas sobre seus Livebooks e conteúdos.
            </p>
            <p className="text-xs text-gray-400">
              Faça uma pergunta sobre qualquer tópico dos seus materiais de estudo.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'
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
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 text-sm">Tutor está digitando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={sendMessage}
            disabled={!message.trim() || isLoading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Pressione Enter para enviar
        </p>
      </div>
    </div>
  );
};

export default TutorChat;