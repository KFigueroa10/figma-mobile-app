import { SignPractice } from "@/components/practice/SignPractice";
import { lessons } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function PracticeContent({ sign }: { sign?: string }) {
  const signToPractice = sign || 'Hola'; // Default to 'Hello' if no sign is specified

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <SignPractice expectedSign={signToPractice} />
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Elige una Seña</CardTitle>
            <CardDescription>Selecciona una seña que quieras practicar.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lessons.map(lesson => (
                <li key={lesson.id}>
                  <Link
                    href={`/practice?sign=${lesson.title}`}
                    className={`block p-3 rounded-md transition-colors ${signToPractice === lesson.title ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`}
                  >
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PracticeSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PracticePage({ searchParams }: { searchParams: { sign?: string } }) {
  return (
    <Suspense fallback={<PracticeSkeleton />}>
      <PracticeContent sign={searchParams.sign} />
    </Suspense>
  );
}
