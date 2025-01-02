import { NextResponse } from 'next/server'
import { fetchFromTMDB } from '@/app/lib/tmdb'
import type { TMDBMovie } from '@/app/lib/tmdb'

type TMDBResponse = {
  results: TMDBMovie[]
  page: number
  total_pages: number
  total_results: number
}

export async function GET() {
  try {
    const data = await fetchFromTMDB<TMDBResponse>('/trending/movie/week?language=de-DE')
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching trending movies:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch trending movies', 
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
      },
      { status: 500 }
    )
  }
}

