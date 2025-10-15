
import { Chatbot } from '@/components/chatbot/Chatbot';
import { Link } from 'react-router-dom';

export default function Chat() {
  return (
    <div className="flex flex-col h-screen bg-transparent">
      <header className="bg-transparent text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/menu" className="text-2xl font-bold">‹</Link>
          <h1 className="text-xl font-semibold drop-shadow-[0_0_6px_rgba(0,0,0,0.9)]">Asistente de Lenguaje de Señas</h1>
          <div className="w-8" />
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <Chatbot />
      </div>
    </div>
  );
}
