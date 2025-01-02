'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import PageContainer from '../components/layout/PageContainer'
import MediaGrid from '../components/content/MediaGrid'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorDisplay from '../components/ui/ErrorDisplay'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { TMDBMovie, TMDBAnime } from '../lib/tmdb'

type MediaItem = TMDBMovie | TMDBAnime

export default function MyListPage() {
  const { user } = useAuth()
  const [myList, setMyList] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyList = async () => {
      if (!user?.watchlist) {
        setMyList([])
        setIsLoading(false)
        return
      }

      try {
        const mediaPromises = user.watchlist.map(async (id) => {
          let response = await fetch(`/api/movies/${id}`)
          
          if (!response.ok) {
            response = await fetch(`/api/anime/${id}`)
          }

          if (!response.ok) {
            throw new Error(`Failed to fetch media with ID ${id}`)
          }

          return response.json()
        })

        const results = await Promise.all(mediaPromises)
        setMyList(results)
      } catch (err) {
        console.error('Error fetching watchlist:', err)
        setError('Fehler beim Laden der Merkliste')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyList()
  }, [user?.watchlist])

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

  if (!user) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-white mb-4">Bitte melden Sie sich an, um Ihre Merkliste zu sehen.</p>
          <Button asChild className="netflix-button">
            <Link href="/login">Zum Login</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  if (myList.length === 0) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-white mb-4">Ihre Merkliste ist leer.</p>
          <Button asChild className="netflix-button">
            <Link href="/">Entdecken Sie neue Titel</Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="netflix-section">
        <h1 className="netflix-title">Meine Liste</h1>
        <MediaGrid items={myList} />
      </div>
    </PageContainer>
  )
}

