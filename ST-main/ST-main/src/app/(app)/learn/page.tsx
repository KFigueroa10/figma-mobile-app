import { LessonCard } from '@/components/learn/LessonCard';
import { lessons } from '@/lib/data';
import type { Lesson } from '@/lib/types';

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-headline tracking-tight">Todas las Lecciones</h2>
        <p className="text-muted-foreground">Navega a través de nuestra biblioteca de señas para aprender.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {lessons.map((lesson: Lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
