'use client'

import { Card } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Play, Info } from 'lucide-react'
import Link from 'next/link'
import { getImageUrl } from '@/app/lib/tmdb'
import type { TMDBMovie, TMDBAnime } from '@/app/lib/tmdb'

interface MediaGridProps {
  items: (TMDBMovie | TMDBAnime)[]
  className?: string
}

export default function MediaGrid({ items, className = '' }: MediaGridProps) {
  return (
    <div className={`content-grid ${className}`}>
      {items.map((item) => (
        <Card key={item.id} className="netflix-hover-card netflix-card">
          <div className="media-card">
            <img 
              src={getImageUrl(item.poster_path)} 
              alt={'title' in item ? item.title : item.name}
              className="w-full h-full object-cover"
            />
            <div className="media-card-overlay">
              <div className="media-card-content">
                <h3 className="font-bold text-white mb-2">
                  {'title' in item ? item.title : item.name}
                </h3>
                <p className="text-sm text-gray-300 line-clamp-2 mb-4">
                  {item.overview}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="netflix-button group/play"
                    asChild
                  >
                    <Link href={`/watch/${item.id}`}>
                      <Play className="mr-2 h-4 w-4 transform group-hover/play:scale-125 transition-transform duration-300" /> 
                      Abspielen
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white"
                    asChild
                  >
                    <Link href={`/info/${item.id}`}>
                      <Info className="mr-2 h-4 w-4" /> Info
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

