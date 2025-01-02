import { NextResponse } from 'next/server'
import { fetchFromTMDB } from '@/app/lib/tmdb'
import type { TMDBMovie, TMDBAnime } from '@/app/lib/tmdb'

type SearchResponse = {
  results: (TMDBMovie | TMDBAnime)[]
  page: number
  total_pages: number
  total_results: number
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const data = await fetchFromTMDB<SearchResponse>(
      `/search/multi?query=${encodeURIComponent(query)}&language=de-DE`
    )

    // Filter to only include movies and TV shows
    const filteredResults = data.results.filter(
      item => 'media_type' in item && (item.media_type === 'movie' || item.media_type === 'tv')
    )

    return NextResponse.json({
      ...data,
      results: filteredResults
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to perform search', 
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

