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
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

