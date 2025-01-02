export type UserRank = 'basic' | 'basicPlus' | 'standard' | 'premium'
export type AccountStatus = 'active' | 'disabled' | 'deleted' | 'suspended'
export type PaymentStatus = 'active' | 'paused' | 'overdue' | 'cancelled'
export type DeviceType = 'PC' | 'Laptop' | 'Tablet' | 'TV' | 'Mobile' | 'Console' | 'Other'

export interface UserDevice {
  id: string
  type: DeviceType
  os: string
  browser: string
  lastActive: string
  ipAddress: string
  isVPN: boolean
  hasAdBlocker: boolean
  location?: string
  userAgent: string
}

export interface UserLogin {
  id: string
  timestamp: string
  ipAddress: string
  device: string
  browser: string
  os: string
  isVPN: boolean
  status: 'success' | 'failed'
  failureReason?: string
  location?: string
}

export interface UserPayment {
  id: string
  status: PaymentStatus
  plan: UserRank
  lastPayment: string
  nextPayment: string
  paymentMethod: string
  cardLast4?: string
  failedAttempts: number
}

export interface UserActivity {
  id: string
  type: 'login' | 'logout' | 'payment' | 'plan_change' | 'password_change' | '2fa_change' | 'device_added' | 'device_removed'
  timestamp: string
  details: string
}

export interface DetailedUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  birthDate: string
  passwordHash: string
  twoFactorEnabled: boolean
  twoFactorMethod?: '2fa_app' | 'sms' | 'email'
  lastIp: string
  lastLogin: string
  vpnDetected: boolean
  currentBrowser: string
  currentOs: string
  deviceType: DeviceType
  rank: UserRank
  accountStatus: AccountStatus
  payment: UserPayment
  adBlockerDetected: boolean
  createdAt: string
  devices: UserDevice[]
  loginHistory: UserLogin[]
  activityLog: UserActivity[]
  totalWatchTime: number
  favoriteGenres: string[]
  contentPreferences: {
    language: string
    subtitlesEnabled: boolean
    audioDescription: boolean
  }
  marketingPreferences: {
    emailEnabled: boolean
    pushEnabled: boolean
    smsEnabled: boolean
  }
  referralCode: string
  referredBy?: string
  notes: string
}

