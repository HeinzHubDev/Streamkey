'use client'

import { useState, useEffect } from 'react'
import PageContainer from '../components/layout/PageContainer'
import MediaGrid from '../components/content/MediaGrid'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorDisplay from '../components/ui/ErrorDisplay'
import type { TMDBAnime } from '../lib/tmdb'

export default function SeriesPage() {
  const [series, setSeries] = useState<TMDBAnime[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch('/api/anime/trending')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSeries(data.results)
      } catch (err) {
        console.error('Error fetching series:', err)
        setError('Fehler beim Laden der Serien')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeries()
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
        <h1 className="netflix-title">Serien</h1>
        <MediaGrid items={series} />
      </div>
    </PageContainer>
  )
}

