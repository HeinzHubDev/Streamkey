import { NextResponse } from 'next/server'

// This is a mock implementation. In a real app, you would update the user's watchlist in your database.
export async function POST(request: Request) {
  try {
    const { contentId } = await request.json()

    // Here you would typically update the user's watchlist in your database
    // For this mock implementation, we'll just return a success response

    return NextResponse.json({ success: true, message: 'Removed from watchlist' })
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to remove from watchlist' },
      { status: 500 }
    )
  }
}

