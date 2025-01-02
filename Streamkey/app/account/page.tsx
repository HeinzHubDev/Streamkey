'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { AlertCircle, CreditCard, Lock, Mail, User, Moon, Sun } from 'lucide-react'

export default function AccountPage() {
  const { user, updateUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [language, setLanguage] = useState('de')
  const [autoplayEnabled, setAutoplayEnabled] = useState(true)
  const [videoQuality, setVideoQuality] = useState('auto')
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
    setEmail(user.email)
    setName(user.name || '')
    setLanguage(user.preferences?.language || 'de')
    setAutoplayEnabled(user.preferences?.autoplayEnabled ?? true)
    setVideoQuality(user.preferences?.videoQuality || 'auto')
  }, [user, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUser({ name, email })
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die neuen Passwörter stimmen nicht überein.",
        variant: "destructive",
      })
      return
    }
    try {
      // In a real app, you would send this to your backend
      console.log('Changing password:', { currentPassword, newPassword })
      toast({
        title: "Passwort geändert",
        description: "Ihr Passwort wurde erfolgreich aktualisiert.",
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Ändern Ihres Passworts.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePreferences = async () => {
    try {
      await updateUser({ 
        preferences: { 
          language, 
          autoplayEnabled, 
          videoQuality,
          isDarkMode: theme === 'dark'
        } 
      })
      toast({
        title: "Einstellungen aktualisiert",
        description: "Ihre Einstellungen wurden erfolgreich aktualisiert.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Aktualisieren Ihrer Einstellungen.",
        variant: "destructive",
      })
    }
  }

  const [selectedPlan, setSelectedPlan] = useState(user?.subscription?.plan || 'basic')

  const handleChangePlan = async () => {
    try {
      await updateUser({ 
        subscription: { 
          ...user?.subscription, 
          plan: selectedPlan 
        } 
      })
      toast({
        title: "Plan geändert",
        description: `Ihr Abonnement wurde erfolgreich auf ${selectedPlan} geändert.`,
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Ändern Ihres Abonnements.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Kontoinformationen werden geladen...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">Sie müssen eingeloggt sein, um diese Seite zu sehen.</p>
          <Button 
            onClick={() => router.push('/login')}
            className="bg-primary hover:bg-primary/90 text-lg px-6 py-2"
          >
            Zum Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-8">Konto</h1>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <User className="mr-2" /> Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Profil aktualisieren
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <Lock className="mr-2" /> Passwort ändern
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Neues Passwort</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Neues Passwort bestätigen</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Passwort ändern
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl flex items-center">
              <CreditCard className="mr-2" /> Abonnement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Aktueller Plan</p>
                <p className="text-sm text-muted-foreground">{user.subscription?.plan || 'Kein aktives Abonnement'}</p>
              </div>
              <Badge 
                variant={user.subscription?.status === 'active' ? 'default' : 'secondary'}
                className="bg-primary text-primary-foreground"
              >
                {user.subscription?.status === 'active' ? 'Aktiv' : 'Inaktiv'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Nächste Abrechnung: {new Date(user.subscription?.expiresAt || '').toLocaleDateString('de-DE')}
            </p>
            <div className="space-y-2">
              <Label htmlFor="plan">Plan ändern</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger id="plan" className="w-full">
                  <SelectValue placeholder="Plan auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleChangePlan} className="bg-primary hover:bg-primary/90">
              Plan ändern
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Einstellungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label htmlFor="language">Sprache</Label>
                <p className="text-sm text-muted-foreground">Wählen Sie Ihre bevorzugte Sprache</p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sprache wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoplay">Autoplay</Label>
                <p className="text-sm text-muted-foreground">Automatisch nächste Episode abspielen</p>
              </div>
              <Switch
                id="autoplay"
                checked={autoplayEnabled}
                onCheckedChange={setAutoplayEnabled}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <Label htmlFor="videoQuality">Videoqualität</Label>
                <p className="text-sm text-muted-foreground">Wählen Sie Ihre bevorzugte Videoqualität</p>
              </div>
              <Select value={videoQuality} onValueChange={setVideoQuality}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Qualität wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="4k">4K</SelectItem>
                  <SelectItem value="hd">HD</SelectItem>
                  <SelectItem value="sd">SD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Erscheinungsbild</Label>
                <p className="text-sm text-muted-foreground">Wählen Sie zwischen hellem und dunklem Modus</p>
              </div>
              <Switch
                id="theme"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => {
                  setTheme(checked ? 'dark' : 'light')
                  handleUpdatePreferences()
                }}
                className="data-[state=checked]:bg-primary"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Switch>
            </div>
            <Button onClick={handleUpdatePreferences} className="bg-primary hover:bg-primary/90">
              Einstellungen speichern
            </Button>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button 
            variant="destructive" 
            className="w-full sm:w-auto text-lg px-6 py-2"
          >
            Konto kündigen
          </Button>
        </div>
      </div>
    </div>
  )
}

