'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatbotTutor } from '@/ai/flows/chatbot-tutor-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Mascot } from '../mascot/Mascot';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "¡Hola! Soy tu tutor de SignFriend. ¡Pregúntame cualquier cosa sobre el lenguaje de señas!" },
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
    <div className="grid md:grid-cols-3 gap-8 h-[calc(100vh-120px)]">
      <div className="md:col-span-2 flex flex-col h-full bg-card border rounded-lg shadow-sm">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {message.role === 'bot' && (
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg px-4 py-3 text-sm',
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}
                >
                  <p>{message.text}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/user/40/40" />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Pensando...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden md:flex flex-col gap-8">
        <div className="h-[300px] flex items-center justify-center bg-card border rounded-lg">
          <Mascot />
        </div>
        <div className="bg-card border rounded-lg p-4 text-center">
          <Bot className="mx-auto w-12 h-12 text-primary mb-2" />
          <h3 className="font-semibold">Tu Tutor de IA</h3>
          <p className="text-sm text-muted-foreground">Pídeme definiciones, reglas gramaticales o contexto cultural en lenguaje de señas.</p>
        </div>
      </div>
    </div>
  );
}