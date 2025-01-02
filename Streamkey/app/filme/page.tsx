'use client'

import { useState, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'
import MediaGrid from '../components/content/MediaGrid'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorDisplay from '../components/ui/ErrorDisplay'
import type { TMDBMovie } from '../lib/tmdb'

export default function MoviesPage() {
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies/trending')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMovies(data.results)
      } catch (err) {
        console.error('Error fetching movies:', err)
        setError('Fehler beim Laden der Filme')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingSpinner />
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorDisplay 
          message={error} 
          onRetry={() => window.location.reload()}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="netflix-section">
        <h1 className="netflix-title">Filme</h1>
        <MediaGrid items={movies} />
      </div>
    </PageContainer>
  )
}

