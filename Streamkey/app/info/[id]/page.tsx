'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Play, Plus, ThumbsUp, AlertCircle, Check } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '../../lib/tmdb'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '@/components/ui/use-toast'

type ContentDetails = {
  id: string
  title: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  genres: Array<{ id: number; name: string }>
  credits: {
    cast: Array<{
      id: number
      name: string
      character: string
      profile_path: string | null
    }>
  }
}

export default function InfoPage() {
  const { id } = useParams()
  const [content, setContent] = useState<ContentDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, addToWatchlist, removeFromWatchlist } = useAuth()
  const { toast } = useToast()

  const isInWatchlist = user?.watchlist?.includes(id as string)

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Try fetching as movie first
        let response = await fetch(`/api/movies/${id}`)
        
        // If not found, try as anime
        if (!response.ok && response.status === 404) {
          response = await fetch(`/api/anime/${id}`)
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setContent(data)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError(`Ein Fehler ist aufgetreten beim Laden des Inhalts: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchContent()
    }
  }, [id])

  const handleWatchlistToggle = async () => {
    if (!user) {
      toast({
        title: "Nicht eingeloggt",
        description: "Bitte loggen Sie sich ein, um diese Funktion zu nutzen.",
        variant: "destructive",
      })
      return
    }

    try {
      if (isInWatchlist) {
        await removeFromWatchlist(id as string)
        toast({
          title: "Entfernt",
          description: "Der Titel wurde von Ihrer Watchlist entfernt.",
        })
      } else {
        await addToWatchlist(id as string)
        toast({
          title: "Hinzugefügt",
          description: "Der Titel wurde zu Ihrer Watchlist hinzugefügt.",
        })
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Aktualisieren Ihrer Watchlist.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-white text-center py-20">Lädt...</div>
  }

  if (error || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141414]">
        <div className="text-red-500 text-center max-w-md mx-auto p-4">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Fehler beim Laden des Inhalts</p>
          <p>{error || 'Inhalt nicht gefunden'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl(content.backdrop_path || content.poster_path, 'original')}
            alt={content.title || content.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <h1 className="text-4xl font-bold text-white mb-4">
            {content.title || content.name}
          </h1>
          
          <div className="flex space-x-4 mb-6">
            <Button asChild className="bg-white text-black hover:bg-gray-200">
              <Link href={`/watch/${content.id}`}>
                <Play className="mr-2 h-4 w-4" /> Abspielen
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="text-white"
              onClick={handleWatchlistToggle}
            >
              {isInWatchlist ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> In Meiner Liste
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Zu Meiner Liste
                </>
              )}
            </Button>
            <Button variant="outline" className="text-white">
              <ThumbsUp className="mr-2 h-4 w-4" /> Bewerten
            </Button>
          </div>

          <div className="max-w-2xl">
            <p className="text-lg text-white mb-4">{content.overview}</p>
            
            <div className="text-gray-400">
              <p className="mb-2">
                Erscheinungsdatum: {content.release_date || content.first_air_date}
              </p>
              <p className="mb-2">
                Bewertung: {Math.round(content.vote_average * 10)}%
              </p>
              <p>
                Genre: {content.genres.map(g => g.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Besetzung</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {content.credits.cast.slice(0, 6).map((actor) => (
            <div key={actor.id} className="text-center">
              <img
                src={getImageUrl(actor.profile_path)}
                alt={actor.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <p className="text-white font-medium">{actor.name}</p>
              <p className="text-gray-400 text-sm">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

