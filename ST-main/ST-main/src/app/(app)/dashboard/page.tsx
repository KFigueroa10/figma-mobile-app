import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { personalizedLearningPaths } from '@/ai/flows/personalized-learning-paths-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { userProgress, userSkills, userProfile, badges } from '@/lib/data';
import { Mascot } from '@/components/mascot/Mascot';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default async function DashboardPage() {
  const recommended = await personalizedLearningPaths({ userProgress, userSkills });

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        <Card className="bg-gradient-to-br from-primary to-blue-400 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">¡Bienvenido de vuelta, {userProfile.name}!</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              ¿Listo para aprender algo nuevo hoy?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Tus Puntos</p>
                <p className="text-3xl font-bold">{userProfile.points}</p>
              </div>
              <Button variant="secondary" asChild>
                <Link href="/learn">
                  Explorar Todas las Lecciones <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recomendado Para Ti</CardTitle>
            <CardDescription>
              Sugerencias impulsadas por IA para ayudarte a mejorar tus puntos débiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommended.lessons.slice(0, 3).map((lesson) => (
              <div key={lesson.lessonId} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <h4 className="font-semibold">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground">{lesson.description}</p>
                </div>
                <Button size="sm" asChild>
                  <Link href={`/practice?sign=${lesson.title}`}>Practicar</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Tu Progreso</CardTitle>
            <CardDescription>
              Mira qué tan lejos has llegado en tu viaje de aprendizaje.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userProgress.map((progress) => (
              <div key={progress.lessonId}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{progress.lessonId}</span>
                  <span className="text-sm font-medium text-muted-foreground">{progress.score}%</span>
                </div>
                <Progress value={progress.score} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="h-[300px] flex items-center justify-center">
            <Mascot />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Trophy className="text-yellow-500" /> Tus Insignias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="flex flex-wrap gap-4">
                {badges.map((badge) => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger>
                      <div className={`p-3 rounded-full bg-secondary ${badge.color}`}>
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
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Tus Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
