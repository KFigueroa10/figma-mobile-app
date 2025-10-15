'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatbotTutor } from '@/ai/flows/chatbot-tutor-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Mascot3D from '../mascot/Mascot3D';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "¡Hola! Soy tu tutor de SignFriend. ¿En qué puedo ayudarte hoy con el lenguaje de señas?" },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatbotTutor({ query: input });
      const botMessage: Message = { role: 'bot', text: response.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'bot', text: 'Lo siento, encontré un error. Por favor, inténtalo de nuevo.' };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Error en el chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-120px)] p-4 md:p-6 max-w-7xl mx-auto">
      {/* Panel principal del chat */}
      <div className="md:col-span-2 flex flex-col h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden relative z-10">
        {/* Encabezado */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat con el tutor</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pregunta sobre lenguaje de señas</p>
        </div>

        {/* Área de mensajes */}
        <ScrollArea className="flex-1 p-4 md:p-6 bg-gray-50/50 dark:bg-gray-950/50" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {message.role === 'bot' && (
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[85%] md:max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-sm',
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                  )}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src="https://picsum.photos/seed/user/40/40" />
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-sm flex items-center gap-2 border border-gray-100 dark:border-gray-700">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">Pensando...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Área de entrada de texto */}
        <div className="p-4">
          <form
            className="flex items-center gap-2 max-w-3xl mx-auto w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500/20 h-11"
              autoFocus
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-11 w-11 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Panel lateral */}
      <div className="hidden md:flex flex-col gap-6 relative z-0">
        <div className="h-[420px] flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg p-6 pointer-events-none">
          <div className="relative w-full h-full">
            <Mascot3D modelUrl={'/models/mascot/personaje.glb'} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-center shadow-lg">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">Tu Tutor de IA</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pídeme definiciones, reglas gramaticales o contexto cultural en lenguaje de señas.</p>
        </div>
      </div>
    </div>
  );
}