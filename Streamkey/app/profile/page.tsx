'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import { User, Camera } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      const timeout = setTimeout(() => {
        router.push('/login')
      }, 2000)
      return () => clearTimeout(timeout)
    }
    setIsLoading(false)
    setName(user.name || '')
    setEmail(user.email || '')
    setAvatar(user.avatar || '')
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser({ name, email, avatar })
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Profilinformationen wurden erfolgreich aktualisiert.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Aktualisieren Ihres Profils.",
        variant: "destructive",
      })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Profil wird geladen...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center">
          <p className="mb-4">Sie müssen eingeloggt sein, um diese Seite zu sehen.</p>
          <Button asChild className="netflix-button">
            <Link href="/login">Zum Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20 netflix-section">
      <div className="max-w-xl mx-auto">
        <Card className="netflix-card border-none">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-2xl flex items-center">
              <User className="mr-2 h-6 w-6" />
              Profil verwalten
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatar || '/placeholder.svg?height=96&width=96'} alt={name || 'Avatar'} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="netflix-input"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  E-Mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="netflix-input"
                />
              </div>
              <div className="pt-4">
                <Button type="submit" className="netflix-button w-full">
                  Änderungen speichern
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-medium mb-2">Abonnement</h3>
                <p className="text-gray-300">
                  Aktueller Plan: {user.subscription?.plan || 'Kein aktives Abonnement'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Status: {user.subscription?.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/account">
                    Abo verwalten
                  </Link>
                </Button>
                <Button 
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Abo kündigen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

