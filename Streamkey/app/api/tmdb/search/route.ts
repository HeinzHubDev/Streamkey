import { NextResponse } from 'next/server'
import { fetchFromTMDB } from '@/app/lib/tmdb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')
    const type = searchParams.get('type') || 'movie'

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    if (!process.env.TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured')
    }

    const data = await fetchFromTMDB(
      `/search/${type}?query=${encodeURIComponent(query)}&language=de-DE&include_adult=false`
    )

    if (!data || !data.results) {
      throw new Error('Invalid response from TMDB API')
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('TMDB search error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error'
      },
      { status: 500 }
    )
  }
}

