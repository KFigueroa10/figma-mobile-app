import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand, MessageCircle, Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Hand className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline text-primary">SignFriend</h1>
          </div>
          <Button asChild>
            <Link href="/dashboard">Comenzar</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-4">
            Aprende Lenguaje de Señas con tu Compañero de IA
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            SignFriend hace que aprender lenguaje de señas sea interactivo, divertido y personalizado. Practica tus señas, chatea con un tutor de IA y mira crecer tus habilidades.
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">Comienza Tu Viaje</Link>
          </Button>
        </section>

        <section className="bg-secondary py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold font-headline text-center mb-12">Características</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Hand className="text-accent" />
                    Lecciones Interactivas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Participa en lecciones que te guían a través de nuevas señas con ayudas visuales y sesiones de práctica.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <Bot className="text-accent" />
                    Reconocimiento de Señas con IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Usa tu cámara para obtener retroalimentación instantánea sobre la precisión de tus señas de nuestra IA avanzada.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline">
                    <MessageCircle className="text-accent" />
                    Tutor Chatbot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>¿Tienes preguntas? Nuestro amigable tutor chatbot está disponible 24/7 para ayudarte con vocabulario y gramática.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SignFriend. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
