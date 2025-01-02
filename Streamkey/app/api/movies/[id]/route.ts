import { NextResponse } from 'next/server'
import { fetchFromTMDB } from '@/app/lib/tmdb'
import type { TMDBMovie } from '@/app/lib/tmdb'

type TMDBMovieDetails = TMDBMovie & {
  videos: {
    results: Array<{
      key: string
      site: string
      type: string
    }>
  }
  credits: {
    cast: Array<{
      id: number
      name: string
      character: string
      profile_path: string | null
    }>
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 })
    }

    const data = await fetchFromTMDB<TMDBMovieDetails>(
      `/movie/${params.id}?language=de-DE&append_to_response=videos,credits`
    )
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch movie details', 
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
      },
      { status: 500 }
    )
  }
}

