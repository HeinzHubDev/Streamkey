const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export type TMDBMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

export type TMDBAnime = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
}

export type TMDBError = {
  status_message: string
  status_code: number
}

export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string {
  if (!path) return '/placeholder.svg?height=400&width=600'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  if (!apiKey) {
    throw new Error('TMDB_API_KEY ist nicht konfiguriert. Bitte fügen Sie den API-Schlüssel in Ihre .env.local Datei ein.')
  }

  try {
    const response = await fetch(`${TMDB_API_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) {
      const errorData = await response.json() as TMDBError
      console.error('TMDB API Error:', errorData)
      if (errorData.status_code === 7) {
        throw new Error('Ungültiger TMDB API-Schlüssel. Bitte überprüfen Sie Ihren API-Schlüssel in der .env.local Datei.')
      }
      throw new Error(
        errorData.status_message || 
        `HTTP Fehler! Status: ${response.status}`
      )
    }

    const data = await response.json()
    
    if (!data) {
      throw new Error('Keine Daten vom TMDB API erhalten')
    }

    return data as T
  } catch (error) {
    console.error(`Fehler beim Abrufen von TMDB (${endpoint}):`, error)
    throw error
  }
}

