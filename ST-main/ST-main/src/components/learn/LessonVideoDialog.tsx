'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import type { Lesson } from '@/lib/types';
import { Video } from 'lucide-react';
import Link from 'next/link';

interface LessonVideoDialogProps {
  lesson: Lesson;
}

export function LessonVideoDialog({ lesson }: LessonVideoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Video className="mr-2" /> Ver Ahora
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{lesson.title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video rounded-lg overflow-hidden bg-black">
          <video
            src={lesson.videoUrl}
            controls
            autoPlay
            loop
            className="w-full h-full"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button asChild className="w-full">
            <Link href={`/practice?sign=${lesson.title}`}>Practicar Seña</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
