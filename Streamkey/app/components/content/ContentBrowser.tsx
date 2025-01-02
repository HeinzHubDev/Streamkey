'use client'

import { useState, useEffect } from 'react'
import { getImageUrl } from '@/app/lib/tmdb'
import type { TMDBMovie, TMDBAnime } from '@/app/lib/tmdb'
import LoadingSpinner from '@/app/components/shared/LoadingSpinner'
import ErrorDisplay from '@/app/components/shared/ErrorDisplay'
import MediaGrid from '@/app/components/content/MediaGrid'

type MediaItem = TMDBMovie | TMDBAnime

export default function ContentBrowser() {
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([])
  const [trendingAnime, setTrendingAnime] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrending = async () => {
    try {
      const [moviesResponse, animeResponse] = await Promise.all([
        fetch('/api/media?action=trending&type=movie'),
        fetch('/api/media?action=trending&type=tv')
      ])

      if (!moviesResponse.ok || !animeResponse.ok) {
        const movieError = await moviesResponse.json()
        const animeError = await animeResponse.json()
        throw new Error(movieError.message || animeError.message || 'Failed to fetch trending content')
      }

      const moviesData = await moviesResponse.json()
      const animeData = await animeResponse.json()

      if (!moviesData.results || !animeData.results) {
        throw new Error('Invalid response format from API')
      }

      setTrendingMovies(moviesData.results)
      setTrendingAnime(animeData.results)
    } catch (err) {
      console.error('Error fetching trending content:', err)
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to load trending content. Please try again later.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrending()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorDisplay 
        message={error} 
        onRetry={() => {
          setIsLoading(true)
          setError(null)
          fetchTrending()
        }}
      />
    )
  }

  return (
    <div className="space-y-8 p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Movies</h2>
        <MediaGrid items={trendingMovies} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Trending Anime</h2>
        <MediaGrid items={trendingAnime} />
      </section>
    </div>
  )
}

