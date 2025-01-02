import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // This is a mock implementation. In a real app, you would verify the session token
  // and return the user data if the session is valid.
  
  const mockUser = {
    id: '1',
    email: 'user@example.com',
    role: 'user',
    name: 'John Doe',
    subscription: {
      plan: 'standard',
      status: 'active',
      expiresAt: '2024-12-31'
    }
  }

  // Simulate a 50% chance of having an active session
  if (Math.random() > 0.5) {
    return NextResponse.json({ user: mockUser })
  } else {
    return NextResponse.json({ user: null })
  }
}

