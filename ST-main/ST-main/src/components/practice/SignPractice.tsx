'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Loader2, PartyPopper, X } from 'lucide-react';
import { signRecognitionFeedback } from '@/ai/flows/sign-recognition-feedback.flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface SignPracticeProps {
  expectedSign: string;
}

type Feedback = {
  accuracy: number;
  feedback: string;
  predictedLabel: string;
};

export function SignPractice({ expectedSign }: SignPracticeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsCameraOn(true);
      setFeedback(null);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      toast({
        variant: 'destructive',
        title: 'Error de Cámara',
        description: 'No se pudo acceder a tu cámara. Por favor, revisa los permisos e inténtalo de nuevo.',
      });
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);


  const captureFrame = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        return reject('Elemento de video no disponible.');
      }
  
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
  
      if (!context) {
        return reject('No se pudo obtener el contexto del canvas.');
      }
  
      try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        resolve(dataUri);
      } catch (error) {
        reject('No se pudo capturar el cuadro del video.');
      }
    });
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);
    setFeedback(null);
  
    try {
      const videoDataUri = await captureFrame();
      const result = await signRecognitionFeedback({
        videoDataUri,
        expectedSign,
      });
      setFeedback(result);
    } catch (error) {
      console.error('El análisis de IA o la captura de cuadros falló:', error);
      toast({
        variant: 'destructive',
        title: 'Análisis Fallido',
        description:
          'Algo salió mal al analizar tu seña. Por favor, inténtalo de nuevo.',
      });
    }
  
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Práctica: "{expectedSign}"</CardTitle>
        <CardDescription>
          Colócate frente a la cámara y muéstranos la seña.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className={isCameraOn ? 'w-full h-full object-cover' : 'hidden'} />
          {!isCameraOn && <Camera className="w-16 h-16 text-muted-foreground" />}
        </div>
        <div className="flex gap-2">
          {!isCameraOn ? (
            <Button onClick={startCamera} className="w-full">
              <Camera className="mr-2" /> Iniciar Cámara
            </Button>
          ) : (
            <>
              <Button onClick={captureAndAnalyze} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <Camera className="mr-2" />
                )}
                Analizar Mi Seña
              </Button>
              <Button onClick={stopCamera} variant="outline" size="icon">
                <X />
              </Button>
            </>
          )}
        </div>
        {isLoading && <p className="text-center text-muted-foreground">La IA está analizando tu seña...</p>}
        {feedback && (
          <Alert variant={(feedback.accuracy >= 70 && feedback.predictedLabel?.toLowerCase().trim() === expectedSign.toLowerCase().trim()) ? 'default' : 'destructive'} className="bg-card">
             <AlertTitle className="font-headline flex items-center gap-2">
              {feedback.accuracy > 90 && <PartyPopper className="text-green-500" />}
              Análisis Completo
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <p className="font-semibold">Se detectó: {feedback.predictedLabel || '—'}</p>
              <p className={`font-semibold ${(feedback.accuracy >= 70 && feedback.predictedLabel?.toLowerCase().trim() === expectedSign.toLowerCase().trim()) ? 'text-green-600' : 'text-red-600'}`}>
                Resultado: {(feedback.accuracy >= 70 && feedback.predictedLabel?.toLowerCase().trim() === expectedSign.toLowerCase().trim()) ? 'Correcto' : 'Incorrecto'}
              </p>
              <div>
                <p className="font-semibold">Precisión: {feedback.accuracy}%</p>
                <Progress value={feedback.accuracy} className="mt-1" />
              </div>
              <div>
                <p className="font-semibold">Comentarios:</p>
                <p>{feedback.feedback}</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
