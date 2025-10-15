import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Lesson } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LessonVideoDialog } from './LessonVideoDialog';

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === lesson.imageId);
  
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Badge variant="secondary" className="w-fit mb-2">{lesson.category}</Badge>
        <CardTitle className="font-headline">{lesson.title}</CardTitle>
        <CardDescription>{lesson.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {placeholder && (
          <div className="relative aspect-video rounded-md overflow-hidden">
            <Image
              src={placeholder.imageUrl}
              alt={lesson.title}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <LessonVideoDialog lesson={lesson} />
      </CardFooter>
    </Card>
  );
}
