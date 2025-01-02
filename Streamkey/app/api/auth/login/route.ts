import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$8Fk7VqF7z8j7q9x9x9x9x.8Fk7VqF7z8j7q9x9x9x9x9x9x9x9', // admin123
    role: 'admin',
    name: 'Admin User',
    subscription: {
      plan: 'premium',
      status: 'active',
      expiresAt: '2024-12-31'
    }
  },
  {
    id: '2',
    email: 'user@example.com',
    password: '$2a$10$8Fk7VqF7z8j7q9x9x9x9x.8Fk7VqF7z8j7q9x9x9x9x9x9x9x9', // password123
    role: 'user',
    name: 'Test User',
    subscription: {
      plan: 'standard',
      status: 'active',
      expiresAt: '2024-12-31'
    }
  }
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      )
    }

    // Find user
    const user = MOCK_USERS.find(u => u.email === email)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Benutzer nicht gefunden.' },
        { status: 401 }
      )
    }

    // For demo purposes, we'll accept these specific passwords
    const isValidPassword = (
      (email === 'admin@example.com' && password === 'admin123') ||
      (email === 'user@example.com' && password === 'password123')
    )

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Falsches Passwort.' },
        { status: 401 }
      )
    }

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Ein Fehler ist aufgetreten beim Login.' },
      { status: 500 }
    )
  }
}

