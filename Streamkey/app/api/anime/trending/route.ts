import { NextResponse } from 'next/server'
import { fetchFromTMDB } from '@/app/lib/tmdb'
import type { TMDBAnime } from '@/app/lib/tmdb'

type TMDBResponse = {
  results: TMDBAnime[]
  page: number
  total_pages: number
  total_results: number
}

export async function GET() {
  try {
    const data = await fetchFromTMDB<TMDBResponse>(
      '/discover/tv?with_genres=16&sort_by=popularity.desc&language=de-DE'
    )
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching trending anime:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch trending anime', 
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
      },
      { status: 500 }
    )
  }
}
``````typescript file="app/api/anime/[id]/route.ts"
import { NextResponse } from 'next/server'
import { fetchFromTMDB } from '@/app/lib/tmdb'
import type { TMDBAnime } from '@/app/lib/tmdb'

type TMDBAnimeDetails = TMDBAnime & {
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
      return NextResponse.json({ error: 'Anime ID is required' }, { status: 400 })
    }

    const data = await fetchFromTMDB<TMDBAnimeDetails>(
      `/tv/${params.id}?language=de-DE&append_to_response=videos,credits`
    )
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching anime details:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch anime details', 
        details: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? (error as Error)?.stack : undefined
      },
      { status: 500 }
    )
  }
}

