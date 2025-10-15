import { ArrowRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import { Mascot } from '../components/mascot/Mascot';

// Mock data - replace with your actual data fetching logic
const userProfile = {
  name: 'Usuario',
  points: 1250
};

const userProgress = [
  { lessonId: 'Saludos Básicos', score: 85 },
  { lessonId: 'Números', score: 60 },
  { lessonId: 'Familia', score: 45 },
];

const userSkills = ['Saludos', 'Números', 'Presentaciones'];

const badges = [
  { id: 1, name: 'Primeros Pasos', icon: Trophy, color: 'bg-yellow-500' },
  { id: 2, name: 'Estudiante Dedicado', icon: Trophy, color: 'bg-blue-500' },
  { id: 3, name: 'Maestro de Saludos', icon: Trophy, color: 'bg-green-500' },
];

const recommendedLessons = [
  {
    lessonId: '1',
    title: 'Saludos Avanzados',
    description: 'Aprende saludos más complejos y formales'
  },
  {
    lessonId: '2',
    title: 'Números del 1 al 100',
    description: 'Domina los números en lengua de señas'
  },
  {
    lessonId: '3',
    title: 'Mi Familia',
    description: 'Aprende a presentar a los miembros de tu familia'
  }
];

export default function Dashboard() {
  return (
    <div className="px-4 md:px-6 py-6">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.25)] border-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">¡Bienvenido de vuelta, {userProfile.name}!</CardTitle>
              <CardDescription className="text-blue-100">
                ¿Listo para aprender algo nuevo hoy?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Tus Puntos</p>
                  <p className="text-3xl font-bold">{userProfile.points}</p>
                </div>
                <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 shadow-sm">
                  <Link to="/learn">Explorar Lecciones <ArrowRight className="ml-2" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Recomendado Para Ti</CardTitle>
              <CardDescription className="text-white/80">
                Sugerencias para ayudarte a mejorar tus puntos débiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedLessons.map((lesson) => (
                <div key={lesson.lessonId} className="flex items-center justify-between p-4 bg-white/10 border border-white/10 hover:border-white/25 rounded-xl transition-colors">
                  <div>
                    <h4 className="font-semibold text-white">{lesson.title}</h4>
                    <p className="text-sm text-white/80">{lesson.description}</p>
                  </div>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm">
                    <Link to={`/practice?sign=${encodeURIComponent(lesson.title)}`}>Practicar</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Tu Progreso</CardTitle>
              <CardDescription className="text-white/80">
                Mira qué tan lejos has llegado en tu viaje de aprendizaje.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userProgress.map((progress) => (
                <div key={progress.lessonId}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-white">{progress.lessonId}</span>
                    <span className="text-sm font-medium text-white/70">{progress.score}%</span>
                  </div>
                  <Progress value={progress.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="h-[300px] flex items-center justify-center bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <img src="src/img/logo.png" alt="Logo" className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow" />
          </Card>
          
          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                <Trophy className="text-yellow-400" /> Tus Insignias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="flex flex-wrap gap-4">
                  {badges.map((badge) => (
                    <Tooltip key={badge.id}>
                      <TooltipTrigger>
                        <div className={`p-3 rounded-full ${badge.color} text-white shadow-md`}>
                          <badge.icon className="w-6 h-6" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{badge.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Tus Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-sm bg-white text-gray-900 border-white">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
