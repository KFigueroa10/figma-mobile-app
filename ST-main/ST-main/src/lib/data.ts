import type { Lesson, UserProgress, Badge } from './types';
import { Award, BookOpen, Star, Zap } from 'lucide-react';

export const lessons: Lesson[] = [
  {
    id: 'L001',
    title: 'Hola',
    description: 'Aprende la seña básica para "Hola".',
    category: 'Saludos',
    imageId: 'hello',
    videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/22/22053.mp4',
  },
  {
    id: 'L002',
    title: 'Gracias',
    description: 'Una seña muy importante y común.',
    category: 'Cortesía',
    imageId: 'thank-you',
    videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/23/23782.mp4',
  },
  {
    id: 'L003',
    title: 'Mi nombre es...',
    description: 'Preséntate con esta frase.',
    category: 'Presentaciones',
    imageId: 'my-name-is',
    videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/22/22998.mp4',
  },
  {
    id: 'L004',
    title: '¿Cómo estás?',
    description: 'Una pregunta común en las conversaciones.',
    category: 'Saludos',
    imageId: 'how-are-you',
    videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/22/22872.mp4',
  },
  {
    id: 'L005',
    title: 'Ayuda',
    description: 'Aprende a pedir ayuda.',
    category: 'Esenciales',
    imageId: 'help',
    videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/21/21497.mp4',
  },
  {
    id: 'L006',
    title: 'Lo siento',
    description: 'Aprende a disculparte.',
    category: 'Cortesía',
    imageId: 'sorry',
    videoUrl: 'https://www.signingsavvy.com/media/mp4-hd/23/23611.mp4',
  },
];

export const userProgress: UserProgress[] = [
  { lessonId: 'L001', score: 95 },
  { lessonId: 'L002', score: 80 },
  { lessonId: 'L003', score: 40 },
];

export const userSkills: string[] = ['Vocabulario para principiantes', 'Saludos básicos'];

export const userProfile = {
  name: 'Alex',
  points: 1250,
};

export const badges: Badge[] = [
  {
    id: 'B001',
    name: 'Primeros Pasos',
    icon: Star,
    color: 'text-yellow-500',
  },
  {
    id: 'B002',
    name: 'Aprendiz Rápido',
    icon: Zap,
    color: 'text-blue-500',
  },
  {
    id: 'B003',
    name: 'Ratón de Biblioteca',
    icon: BookOpen,
    color: 'text-green-500',
  },
  {
    id: 'B004',
    name: 'Profesional de la Práctica',
    icon: Award,
    color: 'text-purple-500',
  },
];
