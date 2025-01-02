'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getImageUrl } from '../lib/tmdb'
import type { TMDBMovie, TMDBAnime } from '../lib/tmdb'
import Link from 'next/link'

interface ContentRowProps {
  title: string
  type: 'trending' | 'movie' | 'tv'
}

type MediaItem = TMDBMovie | TMDBAnime

export default function ContentRow({ title, type }: ContentRowProps) {
  const [items, setItems] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/media?action=${type}&type=${type === 'tv' ? 'tv' : 'movie'}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (data.results) {
          setItems(data.results)
        } else {
          throw new Error('No results found')
        }
      } catch (error) {
        console.error('Error fetching content:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [type])

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth

      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="h-[200px] bg-card/5 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (items.length === 0) {
    return <div className="text-gray-500 p-4">Keine Inhalte verfügbar.</div>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-2">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <div className="relative group">
        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex-none w-[200px] bg-transparent border-0 relative group/item"
            >
              <Link href={`/info/${item.id}`}>
                <div className="aspect-[2/3] rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(item.poster_path)}
                    alt={'title' in item ? item.title : item.name}
                    className="w-full h-full object-cover transform transition-transform group-hover/item:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                  <h3 className="text-center px-2 text-sm font-medium text-foreground">
                    {'title' in item ? item.title : item.name}
                  </h3>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}

