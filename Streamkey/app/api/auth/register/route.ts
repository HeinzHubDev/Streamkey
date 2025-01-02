import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Mock database
let MOCK_USERS = [
  {
    id: '1',
    email: 'admin@example.com',
    password: '$2a$10$8Fk7VqF7z8j7q9x9x9x9x.8Fk7VqF7z8j7q9x9x9x9x9x9x9x9',
    role: 'admin',
    name: 'Admin User',
    subscription: {
      plan: 'premium',
      status: 'active',
      expiresAt: '2024-12-31'
    }
  }
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Alle Felder müssen ausgefüllt werden.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    if (MOCK_USERS.some(user => user.email === email)) {
      return NextResponse.json(
        { success: false, message: 'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user with basic plan
    const newUser = {
      id: (MOCK_USERS.length + 1).toString(),
      email,
      password: hashedPassword,
      role: 'user',
      name,
      subscription: {
        plan: 'basic',
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days trial
      }
    }

    // Add user to mock database
    MOCK_USERS.push(newUser)

    return NextResponse.json({
      success: true,
      message: 'Registrierung erfolgreich',
      redirectTo: '/register/plan' // Add redirect to plan selection
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Ein Fehler ist aufgetreten bei der Registrierung.' },
      { status: 500 }
    )
  }
}

