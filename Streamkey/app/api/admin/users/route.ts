import { NextResponse } from 'next/server'
import type { DetailedUser } from '@/app/types/user'

// Mock data for demonstration
const MOCK_USERS: DetailedUser[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+49123456789',
    birthDate: '1990-01-01',
    passwordHash: '$2a$10$XXX',
    twoFactorEnabled: true,
    lastIp: '192.168.1.1',
    lastLogin: '2024-01-01T12:00:00Z',
    vpnDetected: false,
    currentBrowser: 'Chrome 120',
    currentOs: 'Windows 11',
    deviceType: 'PC',
    rank: 'premium',
    accountStatus: 'active',
    payment: {
      id: 'pay_1',
      status: 'active',
      plan: 'premium',
      lastPayment: '2023-12-01T00:00:00Z',
      nextPayment: '2024-02-01T00:00:00Z'
    },
    adBlockerDetected: true,
    createdAt: '2023-01-01T00:00:00Z',
    devices: [
      {
        id: 'dev_1',
        type: 'PC',
        os: 'Windows 11',
        browser: 'Chrome 120',
        lastActive: '2024-01-01T12:00:00Z',
        ipAddress: '192.168.1.1',
        isVPN: false,
        hasAdBlocker: true
      },
      {
        id: 'dev_2',
        type: 'Mobile',
        os: 'iOS 17',
        browser: 'Safari',
        lastActive: '2024-01-01T10:00:00Z',
        ipAddress: '192.168.1.2',
        isVPN: true,
        hasAdBlocker: false
      }
    ],
    loginHistory: [
      {
        id: 'login_1',
        timestamp: '2024-01-01T12:00:00Z',
        ipAddress: '192.168.1.1',
        device: 'PC',
        browser: 'Chrome 120',
        os: 'Windows 11',
        isVPN: false,
        status: 'success'
      },
      {
        id: 'login_2',
        timestamp: '2024-01-01T10:00:00Z',
        ipAddress: '192.168.1.2',
        device: 'Mobile',
        browser: 'Safari',
        os: 'iOS 17',
        isVPN: true,
        status: 'success'
      }
    ]
  },
  // Add more mock users as needed
]

export async function GET() {
  // In a real app, fetch users from database
  return NextResponse.json(MOCK_USERS)
}

