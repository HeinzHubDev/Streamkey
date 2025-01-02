'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { Film } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading: isAuthLoading } = useAuth()

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Registrierung erfolgreich. Bitte loggen Sie sich ein.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsLoading(true)

    try {
      const success = await login(email, password, rememberMe)
      if (success) {
        router.push('/')
      } else {
        setError('Ein unerwarteter Fehler ist aufgetreten.')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten beim Login.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#141414]">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Film className="h-12 w-auto text-red-600" />
            <span className="ml-2 text-2xl font-bold text-white">Streamkey</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/filme" className="text-gray-300 hover:text-white">
              Filme
            </Link>
            <Link href="/serien" className="text-gray-300 hover:text-white">
              Serien
            </Link>
            <Link href="/meine-liste" className="text-gray-300 hover:text-white">
              Meine Liste
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-black/90 p-8 rounded-lg">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Einloggen
            </h1>
          </div>

          {successMessage && (
            <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-500/10 text-red-500 border-red-500/20">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                id="email"
                type="email"
                placeholder="E-Mail-Adresse oder Handynummer"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-800/50 text-white border-zinc-700 rounded-md focus:border-zinc-500 focus:ring-0"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-zinc-800/50 text-white border-zinc-700 rounded-md focus:border-zinc-500 focus:ring-0"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-md font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Wird eingeloggt...' : 'Einloggen'}
            </Button>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-zinc-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="ml-2 text-zinc-400">
                  Benutzerdaten merken
                </label>
              </div>
              <Link href="/reset-password" className="text-zinc-400 hover:underline">
                Passwort vergessen?
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-zinc-400">
              Neu bei Streamkey?{' '}
              <Link href="/register" className="text-white hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

