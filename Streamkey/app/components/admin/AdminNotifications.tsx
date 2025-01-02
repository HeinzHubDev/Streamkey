'use client'

import { useState, useEffect } from 'react'
import { Bell, UserPlus, AlertTriangle, Upload, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'

type AdminNotification = {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: Date
  type: 'new_user' | 'system_alert' | 'content_upload' | 'usage_stats'
  actionUrl?: string
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulierte API-Abfrage für Admin-Benachrichtigungen
    const fetchNotifications = async () => {
      // In a real application, this would be an API call
      const mockNotifications: AdminNotification[] = [
        {
          id: '1',
          title: 'Neuer Benutzer registriert',
          message: 'Ein neuer Benutzer hat sich angemeldet: john@example.com',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // vor 30 Minuten
          type: 'new_user',
          actionUrl: '/admin/users'
        },
        {
          id: '2',
          title: 'Systemwarnung',
          message: 'Hohe CPU-Auslastung auf Server 2',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // vor 2 Stunden
          type: 'system_alert',
          actionUrl: '/admin/system'
        },
        {
          id: '3',
          title: 'Neuer Inhalt hochgeladen',
          message: 'Neuer Film "The Matrix" wurde hochgeladen',
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // vor 1 Tag
          type: 'content_upload',
          actionUrl: '/admin/content'
        },
        {
          id: '4',
          title: 'Nutzungsstatistiken',
          message: 'Die Streaming-Nutzung ist um 20% gestiegen',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // vor 2 Tagen
          type: 'usage_stats',
          actionUrl: '/admin/stats'
        },
      ]
      setNotifications(mockNotifications)
    }

    if (user && user.role === 'admin') {
      fetchNotifications()
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
    // In a real application, you would also update this on the server
  }

  const handleNotificationClick = (notification: AdminNotification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Gerade eben'
    if (diffInSeconds < 3600) return `Vor ${Math.floor(diffInSeconds / 60)} Minuten`
    if (diffInSeconds < 86400) return `Vor ${Math.floor(diffInSeconds / 3600)} Stunden`
    return `Vor ${Math.floor(diffInSeconds / 86400)} Tagen`
  }

  const getNotificationIcon = (type: AdminNotification['type']) => {
    switch (type) {
      case 'new_user':
        return <UserPlus className="h-4 w-4" />
      case 'system_alert':
        return <AlertTriangle className="h-4 w-4" />
      case 'content_upload':
        return <Upload className="h-4 w-4" />
      case 'usage_stats':
        return <Activity className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin-Benachrichtigungen</p>
            <p className="text-xs text-muted-foreground">
              {unreadCount === 0 ? 'Keine neuen Benachrichtigungen' : `${unreadCount} ungelesen`}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <DropdownMenuItem>
            <span className="text-muted-foreground">Keine Benachrichtigungen vorhanden</span>
          </DropdownMenuItem>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              onSelect={() => handleNotificationClick(notification)}
              className="flex items-start gap-2 p-3"
            >
              <span className="mt-0.5 text-primary">
                {getNotificationIcon(notification.type)}
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{notification.title}</span>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{notification.message}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(notification.timestamp)}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

