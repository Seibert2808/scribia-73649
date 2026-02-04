import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { useCustomAuth } from '@/hooks/useCustomAuth';

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
  isQuestion?: boolean;
  questionId?: string;
}

export const Bia: React.FC = () => {
  const { user } = useCustomAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const questions = [
    {
      id: 'q1',
      text: `Olá, ${user?.name || 'usuário'}! 😊\n\nEu sou a *Bia*, sua agente de perfil do **ScribIA**.\n\nMinha função é conversar brevemente com você para identificar seu perfil de aprendizado e comportamento cognitivo. Assim posso personalizar o formato e estilo dos Livebooks que o sistema gera especialmente para você!\n\nPara começar, me diga qual é a sua área de atuação profissional?`,
      type: 'text'
    },
    {
      id: 'q2',
      text: 'Interessante! E quais são seus principais objetivos profissionais no momento?',
      type: 'text'
    },
    {
      id: 'q3',
      text: 'Perfeito! Agora preciso entender melhor seu estilo de trabalho. Como você prefere trabalhar?',
      type: 'radio',
      options: [
        'Individualmente, com foco e concentração',
        'Em equipe, colaborando com outros',
        'Híbrido, alternando entre individual e equipe',
        'Depende do projeto e contexto'
      ]
    },
    {
      id: 'q4',
      text: 'Última pergunta! Qual é seu principal motivador no trabalho?',
      type: 'radio',
      options: [
        'Crescimento pessoal e aprendizado',
        'Reconhecimento e conquistas',
        'Estabilidade e segurança',
        'Impacto e propósito'
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setTimeout(() => {
        addBotMessage(questions[0].text, questions[0]);
      }, 1000);
    }
  }, []);

  const addBotMessage = (content: string, question?: any) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now(),
        type: 'bot',
        content,
        timestamp: new Date(),
        options: question?.options,
        isQuestion: true,
        questionId: question?.id
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now(),
      type: 'user', 
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    addUserMessage(currentInput);
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: currentInput
    }));
    
    setCurrentInput('');
    
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        addBotMessage(questions[currentQuestionIndex + 1].text, questions[currentQuestionIndex + 1]);
      } else {
        addBotMessage(`Perfeito, ${user?.name || 'usuário'}! 🎉\n\nObrigada pela conversa! Com base no seu perfil de aprendizado, agora posso personalizar os Livebooks do ScribIA especialmente para você.\n\nSeus próximos Livebooks serão formatados no estilo que mais combina com seu jeito de aprender e processar informações. ✨`);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-6 bg-white border-b shadow-sm">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center text-white mr-4">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Bia - Análise de Perfil</h2>
          <p className="flex items-center text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'bot' 
                ? 'bg-gradient-to-br from-purple-600 to-purple-400 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {message.type === 'bot' ? <Bot size={20} /> : <User size={20} />}
            </div>
            
            <div className={`flex flex-col max-w-[70%] ${message.type === 'user' ? 'items-end' : ''}`}>
              <div className={`rounded-2xl p-3 shadow-sm ${
                message.type === 'user' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-900'
              }`}>
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="leading-relaxed">{line}</p>
                ))}
              </div>
              
              {message.options && (
                <div className="flex flex-col gap-2 mt-3 w-full">
                  {message.options.map((option, i) => (
                    <button
                      key={i}
                      className="bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-purple-600 rounded-xl p-3 text-left text-sm text-gray-700 transition-all hover:-translate-y-0.5"
                      onClick={() => {
                        setCurrentInput(option);
                        setTimeout(handleSendMessage, 100);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              <span className="text-xs text-gray-500 mt-1">
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-400 text-white">
              <Bot size={20} />
            </div>
            <div className="bg-white rounded-2xl p-3 shadow-sm flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-end gap-3">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua resposta..."
            rows={1}
            disabled={currentQuestionIndex >= questions.length}
            className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || currentQuestionIndex >= questions.length}
            className="w-11 h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-all hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
