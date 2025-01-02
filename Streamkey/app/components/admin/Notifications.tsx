'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: Date
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Simulierte API-Abfrage für Benachrichtigungen
    const fetchNotifications = async () => {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Neue Registrierung',
          message: 'Ein neuer Benutzer hat sich registriert.',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30) // vor 30 Minuten
        },
        {
          id: '2',
          title: 'Speicherwarnung',
          message: 'Der Speicherplatz ist zu 90% ausgelastet.',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // vor 2 Stunden
        },
        {
          id: '3',
          title: 'Neuer Film hochgeladen',
          message: 'Ein neuer Film wurde zum Katalog hinzugefügt.',
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // vor 1 Tag
        },
      ]
      setNotifications(mockNotifications)
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Gerade eben'
    if (diffInSeconds < 3600) return `Vor ${Math.floor(diffInSeconds / 60)} Minuten`
    if (diffInSeconds < 86400) return `Vor ${Math.floor(diffInSeconds / 3600)} Stunden`
    return `Vor ${Math.floor(diffInSeconds / 86400)} Tagen`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel>Benachrichtigungen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem>Keine neuen Benachrichtigungen</DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} onSelect={() => markAsRead(notification.id)}>
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{notification.title}</span>
                  {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                </div>
                <span className="text-sm text-gray-500">{notification.message}</span>
                <span className="text-xs text-gray-400">{formatTimestamp(notification.timestamp)}</span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

