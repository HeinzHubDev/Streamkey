import { NextResponse } from 'next/server'

export async function GET() {
  // This is mock data. In a real application, you would fetch this from your database.
  const mockUserLocations = [
    { country: 'United States', count: 1000 },
    { country: 'Germany', count: 500 },
    { country: 'Japan', count: 300 },
    { country: 'Brazil', count: 200 },
    { country: 'India', count: 400 },
    { country: 'United Kingdom', count: 350 },
    { country: 'Canada', count: 250 },
    { country: 'Australia', count: 150 },
    { country: 'France', count: 300 },
    { country: 'Spain', count: 200 },
  ]

  return NextResponse.json(mockUserLocations)
}

