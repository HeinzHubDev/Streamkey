'use client'

import { useState, useEffect } from 'react'
import { Play, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getImageUrl } from '../lib/tmdb'
import type { TMDBMovie, TMDBAnime } from '../lib/tmdb'

type FeaturedItem = TMDBMovie | TMDBAnime

export default function FeaturedContent() {
  const [featured, setFeatured] = useState<FeaturedItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/media?action=featured')
        const data = await response.json()
        if (data.featured) {
          setFeatured(data.featured)
        }
      } catch (error) {
        console.error('Error fetching featured content:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeatured()
  }, [])

  if (isLoading || !featured) {
    return <div className="h-[50vh] bg-card/5 animate-pulse" />
  }

  return (
    <div className="relative h-[50vh] w-full">
      <div className="absolute inset-0">
        <img
          src={getImageUrl(featured.backdrop_path, 'original')}
          alt={'title' in featured ? featured.title : featured.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-4xl font-bold text-foreground">
            {'title' in featured ? featured.title : featured.name}
          </h2>
          <p className="text-lg text-foreground/80 line-clamp-3">
            {featured.overview}
          </p>
          <div className="flex space-x-4">
            <Button asChild>
              <Link href={`/watch/${featured.id}`}>
                <Play className="mr-2 h-4 w-4" /> Abspielen
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/info/${featured.id}`}>
                <Info className="mr-2 h-4 w-4" /> Mehr Infos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

