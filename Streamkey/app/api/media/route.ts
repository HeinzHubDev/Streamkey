import { NextResponse } from 'next/server'
import { fetchFromTMDB } from '@/app/lib/tmdb'
import type { TMDBMovie, TMDBAnime } from '@/app/lib/tmdb'

type TMDBResponse = {
  results: (TMDBMovie | TMDBAnime)[]
  page: number
  total_pages: number
  total_results: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'movie'
    const action = searchParams.get('action')

    if (!process.env.TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is not configured')
    }

    if (action === 'trending') {
      const endpoint = type === 'movie' 
        ? '/trending/movie/week?language=de-DE'
        : '/discover/tv?with_genres=16&sort_by=popularity.desc&language=de-DE'

      const data = await fetchFromTMDB<TMDBResponse>(endpoint)
      
      if (!data || !data.results) {
        throw new Error('Invalid response from TMDB API')
      }

      return NextResponse.json(data)
    }

    if (action === 'featured') {
      const endpoint = '/trending/all/day?language=de-DE'
      const data = await fetchFromTMDB<TMDBResponse>(endpoint)
      
      if (!data || !data.results || data.results.length === 0) {
        throw new Error('Invalid response from TMDB API')
      }

      // Select a random item from the first 5 results
      const randomIndex = Math.floor(Math.random() * Math.min(5, data.results.length))
      const featured = data.results[randomIndex]

      return NextResponse.json({ featured })
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Media API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch media data',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    )
  }
}

