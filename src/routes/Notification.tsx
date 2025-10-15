import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FiBell, FiCheck, FiInbox } from 'react-icons/fi'
import { fetchNotifications, markAsRead, markAllAsRead, type NotificationItem } from '@/lib/notifications'

export default function Notification() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const data = await fetchNotifications()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function onMarkRead(id: string) {
    await markAsRead(id)
    load()
  }

  async function onMarkAll() {
    await markAllAsRead()
    load()
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-white text-2xl font-bold">Notificaciones</h1>
          <p className="text-white/80 text-sm">Mensajes sobre tu progreso y tablero</p>
        </div>
        <Button onClick={onMarkAll} variant="secondary" className="bg-white/90 hover:bg-white text-gray-900 border border-white/60">
          <FiCheck className="mr-2" /> Marcar todo como leído
        </Button>
      </div>

      <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><FiBell /> Bandeja</CardTitle>
          <CardDescription className="text-white/80">Últimas actividades y recordatorios</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-white/80">Cargando...</div>
          ) : items.length === 0 ? (
            <div className="flex items-center gap-2 text-white/70"><FiInbox/> No tienes notificaciones</div>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-2">
              <ul className="space-y-3">
                {items.map((n) => (
                  <li key={n.id} className={`p-4 rounded-xl border ${n.read ? 'border-white/5 bg-white/5' : 'border-blue-500/30 bg-blue-500/10'} `}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm uppercase tracking-wide text-white/60">{n.type}</div>
                        <div className="font-semibold text-white">{n.title}</div>
                        <div className="text-white/80 text-sm mt-1">{n.message}</div>
                        <div className="text-white/60 text-xs mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                      {!n.read && (
                        <Button size="sm" onClick={() => onMarkRead(n.id)} className="bg-blue-600 hover:bg-blue-700">Marcar leído</Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
