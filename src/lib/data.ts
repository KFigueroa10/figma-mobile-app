// Simple shared data used by Learn and Practice pages
export type Lesson = {
  id: string;
  title: string;
  description: string;
};

export const lessons: Lesson[] = [
  { id: 'greetings', title: 'Saludos Básicos', description: 'Aprende a saludar y despedirte' },
  { id: 'numbers', title: 'Números', description: 'Cuenta del 1 al 20 con señas' },
  { id: 'family', title: 'Familia', description: 'Presenta a los miembros de tu familia' },
  { id: 'colors', title: 'Colores', description: 'Nombra colores comunes en señas' },
  { id: 'food', title: 'Comida', description: 'Vocabulario de alimentos básicos' },
  { id: 'time', title: 'Tiempo', description: 'Días, meses y horas' },
];
