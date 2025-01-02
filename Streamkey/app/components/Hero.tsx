'use client'

import { useState, useEffect } from 'react'
import { Play, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getImageUrl } from '../lib/tmdb'
import type { TMDBMovie } from '../lib/tmdb'

export default function Hero() {
  const [featured, setFeatured] = useState<TMDBMovie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/media?action=trending&type=movie')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (data.results?.length > 0) {
          setFeatured(data.results[0])
        } else {
          throw new Error('No featured content available')
        }
      } catch (error) {
        console.error('Error fetching featured content:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  if (error) {
    return <div className="h-[80vh] bg-background flex items-center justify-center text-white">{error}</div>
  }

  if (isLoading || !featured) {
    return <div className="h-[80vh] bg-background animate-pulse" />
  }

  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        <img
          src={getImageUrl(featured.backdrop_path, 'original')}
          alt={featured.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
            {featured.title}
          </h1>
          <p className="text-lg text-foreground/90 line-clamp-3">
            {featured.overview}
          </p>
          <div className="flex space-x-4">
            <Button size="lg" asChild>
              <Link href={`/watch/${featured.id}`}>
                <Play className="mr-2 h-5 w-5" />
                Abspielen
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/info/${featured.id}`}>
                <Info className="mr-2 h-5 w-5" />
                Mehr Infos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

