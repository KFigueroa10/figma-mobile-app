export type Lesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  imageId: string;
  videoUrl: string;
};

export type UserProgress = {
  lessonId: string;
  score: number;
};

export type Badge = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};
