export type NotificationItem = {
  id: string;
  type: 'progress' | 'achievement' | 'reminder' | 'system';
  title: string;
  message: string;
  createdAt: string; // ISO string
  read: boolean;
  meta?: Record<string, any>;
};

let store: NotificationItem[] = [
  {
    id: 'n1',
    type: 'progress',
    title: 'Progreso de práctica',
    message: 'Completaste 3 prácticas hoy. ¡Sigue así! 🎉',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read: false,
    meta: { completedPractices: 3 },
  },
  {
    id: 'n2',
    type: 'achievement',
    title: 'Logro desbloqueado',
    message: 'Alcanzaste una racha de 5 días practicando.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: false,
    meta: { streakDays: 5 },
  },
  {
    id: 'n3',
    type: 'reminder',
    title: 'Recordatorio',
    message: 'Practica 5 minutos para mantener tu racha activa.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    read: true,
  },
];

export async function fetchNotifications(): Promise<NotificationItem[]> {
  // Simula fetch; en producción reemplazar por llamada a API
  await new Promise((r) => setTimeout(r, 150));
  // Orden desc por fecha
  return [...store].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function markAsRead(id: string): Promise<void> {
  store = store.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export async function markAllAsRead(): Promise<void> {
  store = store.map((n) => ({ ...n, read: true }));
}

export async function addNotification(n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'> & { id?: string; read?: boolean; createdAt?: string }): Promise<NotificationItem> {
  const item: NotificationItem = {
    id: n.id || crypto.randomUUID(),
    createdAt: n.createdAt || new Date().toISOString(),
    read: n.read ?? false,
    type: n.type,
    title: n.title,
    message: n.message,
    meta: n.meta,
  };
  store = [item, ...store];
  return item;
}
