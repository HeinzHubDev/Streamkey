'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Info, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '../lib/tmdb'
import type { TMDBMovie, TMDBAnime } from '../lib/tmdb'

type SearchResult = (TMDBMovie | TMDBAnime) & {
  media_type: 'movie' | 'tv'
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchContent = async () => {
      if (!query) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResults(data.results)
      } catch (err) {
        console.error('Search error:', err)
        setError('Fehler bei der Suche')
      } finally {
        setIsLoading(false)
      }
    }

    searchContent()
  }, [query])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>Suche läuft...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center max-w-md mx-auto p-4">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Fehler bei der Suche</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-20 px-6">
      <h1 className="text-3xl font-bold text-white mb-2">Suchergebnisse</h1>
      <p className="text-gray-400 mb-8">
        {query ? `Für "${query}"` : 'Bitte geben Sie einen Suchbegriff ein'}
      </p>

      {results.length === 0 ? (
        <div className="text-center text-white">
          <p className="mb-4">
            {query 
              ? 'Keine Ergebnisse gefunden.' 
              : 'Geben Sie einen Suchbegriff ein, um zu beginnen.'
            }
          </p>
          <Button asChild>
            <Link href="/">Zurück zur Startseite</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((item) => (
            <Card key={item.id} className="bg-zinc-800 text-white overflow-hidden">
              <img 
                src={getImageUrl(item.poster_path)} 
                alt={'title' in item ? item.title : item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold mb-2">{'title' in item ? item.title : item.name}</h3>
                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{item.overview}</p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700"
                    asChild
                  >
                    <Link href={`/watch/${item.id}`}>
                      <Play className="mr-2 h-4 w-4" /> Abspielen
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    asChild
                  >
                    <Link href={`/info/${item.id}`}>
                      <Info className="mr-2 h-4 w-4" /> Mehr Info
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

