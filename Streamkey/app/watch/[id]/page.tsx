'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VideoPlayer from '../../components/content/VideoPlayer'
import { getImageUrl } from '../../lib/tmdb'
import { AlertCircle } from 'lucide-react'

type VideoContent = {
  id: string
  title: string
  name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  videos?: {
    results: Array<{
      key: string
      site: string
      type: string
    }>
  }
}

export default function WatchPage() {
  const { id } = useParams()
  const [content, setContent] = useState<VideoContent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return <div className="text-white text-center py-20">Lädt...</div>
  }

  if (error || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-red-500 text-center max-w-md mx-auto p-4">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold mb-2">Fehler beim Laden des Inhalts</p>
          <p>{error || 'Inhalt nicht gefunden'}</p>
        </div>
      </div>
    )
  }

  // Get trailer or first video
  const video = content.videos?.results.find(v => v.type === 'Trailer') || content.videos?.results[0]
  const videoUrl = video?.site === 'YouTube' 
    ? `https://www.youtube.com/embed/${video.key}?autoplay=1`
    : 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer 
        src={videoUrl}
        title={content.title || content.name || ''}
        poster={getImageUrl(content.backdrop_path || content.poster_path, 'original')}
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">{content.title || content.name}</h1>
        <p className="text-gray-300">{content.overview}</p>
      </div>
    </div>
  )
}

