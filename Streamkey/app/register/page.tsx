'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Film } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface RegisterFormData {
  name: string
  email: string
  password: string
}

interface RegisterResponse {
  success: boolean
  message: string
  redirectTo?: string
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data: RegisterResponse = await response.json()

      if (response.ok && data.success) {
        // Redirect to plan selection instead of login
        router.push(data.redirectTo || '/register/plan')
      } else {
        setError(data.message || 'Registrierung fehlgeschlagen.')
      }
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-black bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/50" />
      
      <header className="relative z-10 px-4 py-6">
        <Link href="/" className="flex items-center">
          <Film className="h-12 w-auto text-red-600" />
          <span className="ml-2 text-2xl font-bold text-white">Streamkey</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md bg-black/75 text-white">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Registrieren</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-zinc-800 text-white border-zinc-700 rounded focus:border-zinc-500 focus:ring-0"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-Mail-Adresse"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-zinc-800 text-white border-zinc-700 rounded focus:border-zinc-500 focus:ring-0"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Passwort"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 bg-zinc-800 text-white border-zinc-700 rounded focus:border-zinc-500 focus:ring-0"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded font-medium"
                disabled={isLoading}
              >
                {isLoading ? 'Registrierung läuft...' : 'Weiter zu den Plänen'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-zinc-400">
                Bereits ein Konto?{' '}
                <Link href="/login" className="text-white hover:underline">
                  Jetzt einloggen
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

