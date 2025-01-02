'use client'

import { useState, useEffect } from 'react'
import { Bell, Play, List, Calendar, CreditCard } from 'lucide-react'
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

type Notification = {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: Date
  type: 'new_content' | 'watchlist' | 'continue_watching' | 'subscription' | 'system' | 'recommendation'
  actionUrl?: string
}

export function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Simulierte API-Abfrage für Benutzer-Benachrichtigungen
    const fetchNotifications = async () => {
      // In a real application, this would be an API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Neue Staffel verfügbar',
          message: 'Staffel 2 von "Stranger Things" ist jetzt verfügbar!',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // vor 30 Minuten
          type: 'new_content',
          actionUrl: '/watch/stranger-things-s2'
        },
        {
          id: '2',
          title: 'Weiterschauen',
          message: 'Setzen Sie "The Crown" dort fort, wo Sie aufgehört haben',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // vor 2 Stunden
          type: 'continue_watching',
          actionUrl: '/watch/the-crown'
        },
        {
          id: '3',
          title: 'Watchlist Erinnerung',
          message: '"Inception" ist nur noch 3 Tage verfügbar',
          read: true,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // vor 1 Tag
          type: 'watchlist',
          actionUrl: '/watch/inception'
        },
        {
          id: '4',
          title: 'Abo-Status',
          message: 'Ihr Premium-Abonnement wird in 3 Tagen verlängert',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // vor 2 Tagen
          type: 'subscription',
          actionUrl: '/account/subscription'
        },
        {
          id: '5',
          title: 'Neue Empfehlung',
          message: 'Basierend auf Ihrem Geschmack: "The Witcher"',
          read: false,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // vor 3 Tagen
          type: 'recommendation',
          actionUrl: '/info/the-witcher'
        }
      ]
      setNotifications(mockNotifications)
    }

    if (user) {
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

  const handleNotificationClick = (notification: Notification) => {
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

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_content':
        return <Play className="h-4 w-4" />
      case 'watchlist':
        return <List className="h-4 w-4" />
      case 'continue_watching':
        return <Play className="h-4 w-4" />
      case 'subscription':
        return <CreditCard className="h-4 w-4" />
      case 'recommendation':
        return <Calendar className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Benachrichtigungen</p>
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
                    <span className="h-2 w-2 rounded-full bg-primary" />
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

