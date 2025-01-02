import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { action, contentId } = await request.json()

    if (!action || !contentId) {
      return NextResponse.json(
        { success: false, message: 'Action und ContentId sind erforderlich' },
        { status: 400 }
      )
    }

    // Hier würden Sie normalerweise die Watchlist in Ihrer Datenbank aktualisieren
    // Dies ist eine Mock-Implementierung
    const message = action === 'add' 
      ? 'Zur Watchlist hinzugefügt' 
      : 'Von Watchlist entfernt'

    return NextResponse.json({ 
      success: true, 
      message,
      action,
      contentId
    })
  } catch (error) {
    console.error('Watchlist error:', error)
    return NextResponse.json(
      { success: false, message: 'Fehler bei der Watchlist-Operation' },
      { status: 500 }
    )
  }
}

