'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { config } from '@/app/config'
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
  role: 'admin' | 'user'
  name?: string
  avatar?: string
  subscription?: {
    plan: 'basic' | 'standard' | 'premium'
    status: 'active' | 'inactive'
    expiresAt: string
  }
  watchlist?: string[]
  preferences?: {
    language: string
    autoplayEnabled: boolean
    videoQuality: string
    isDarkMode: boolean
  }
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, remember: boolean) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (data: Partial<User>) => Promise<User | void>
  isLoading: boolean
  addToWatchlist: (contentId: string) => Promise<void>
  removeFromWatchlist: (contentId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkSession = async () => {
      try {
        // First check localStorage
        const storedUser = localStorage.getItem('user')
        const rememberMe = localStorage.getItem('rememberMe') === 'true'
        
        if (storedUser && rememberMe) {
          setUser(JSON.parse(storedUser))
          setIsLoading(false)
          return
        }

        // Then check session API with retry logic
        let retryCount = 0
        
        while (retryCount < config.auth.retryAttempts) {
          try {
            const response = await fetch('/api/auth/session', {
              method: 'GET',
              credentials: 'include',
            })

            if (!response.ok) {
              throw new Error(`Session check failed: ${response.status}`)
            }

            const data = await response.json()
            if (data.user) {
              setUser(data.user)
              if (rememberMe) {
                localStorage.setItem('user', JSON.stringify(data.user))
              }
              break
            } else {
              throw new Error('No user data in response')
            }
          } catch (error) {
            console.error('Session check attempt failed:', error)
            retryCount++
            
            if (retryCount === config.auth.retryAttempts) {
              toast({
                title: "Session Error",
                description: "Failed to verify your session. Please try logging in again.",
                variant: "destructive",
              })
              throw error
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, config.auth.retryDelay))
          }
        }
      } catch (error) {
        console.error('Session check failed:', error)
        // Clear local storage and set user to null on error
        localStorage.removeItem('user')
        localStorage.removeItem('rememberMe')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [toast])

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      if (data.success && data.user) {
        setUser(data.user)
        if (remember) {
          localStorage.setItem('user', JSON.stringify(data.user))
          localStorage.setItem('rememberMe', 'true')
        }
        return true
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
      localStorage.removeItem('rememberMe')
      router.push('/login')
    }
  }

  const updateUser = async (data: Partial<User>) => {
    if (user) {
      try {
        const response = await fetch('/api/user/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to update user')
        }

        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        if (localStorage.getItem('rememberMe') === 'true') {
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }

        return updatedUser
      } catch (error) {
        console.error('Error updating user:', error)
        throw error
      }
    }
  }

  const addToWatchlist = async (contentId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', contentId }),
      })

      if (!response.ok) {
        throw new Error('Failed to add to watchlist')
      }

      const updatedUser = {
        ...user,
        watchlist: [...(user.watchlist || []), contentId],
      }
      setUser(updatedUser)
      if (localStorage.getItem('rememberMe') === 'true') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      throw error
    }
  }

  const removeFromWatchlist = async (contentId: string) => {
    if (!user) return

    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', contentId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove from watchlist')
      }

      const updatedUser = {
        ...user,
        watchlist: user.watchlist?.filter(id => id !== contentId) || [],
      }
      setUser(updatedUser)
      if (localStorage.getItem('rememberMe') === 'true') {
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser, 
      isLoading, 
      addToWatchlist, 
      removeFromWatchlist 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

