'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Film } from 'lucide-react'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Alert, AlertDescription } from '@/app/components/ui/alert'
import Link from 'next/link'

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // In a real app, you would call your API here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    } finally {
      setIsLoading(false)
    }
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
            <CardTitle className="text-3xl font-bold">Passwort zurücksetzen</CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <Alert className="bg-green-500/10 text-green-500 border-green-500/20">
                <AlertDescription>
                  Eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts wurde gesendet.
                  Sie werden in Kürze zur Login-Seite weitergeleitet.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-zinc-800 text-white border-zinc-700 rounded focus:border-zinc-500 focus:ring-0"
                    required
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert className="bg-red-500/10 text-red-500 border-red-500/20">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? 'Wird gesendet...' : 'Link zum Zurücksetzen senden'}
                </Button>

                <div className="text-center">
                  <Link href="/login" className="text-zinc-400 hover:underline">
                    Zurück zum Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

