'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authUtils } from '../app/services/auth'
import { apiService } from '../app/services/api'

interface User {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Validate token and load user on mount
  useEffect(() => {
    let isCancelled = false; // Prevent state updates after unmount (React StrictMode protection)

    const initAuth = async () => {
      try {
        const token = authUtils.getToken()
        const storedUser = authUtils.getUser()

        if (token && storedUser) {
          // Validate token by fetching user profile
          try {
            const profile = await apiService.getProfile()
            if (!isCancelled) {
              setUser(profile)
            }
          } catch (error) {
            console.error('Token validation failed:', error)
            // Try to refresh token before giving up
            try {
              const refreshResponse = await apiService.refreshToken()
              if (!isCancelled) {
                authUtils.setAuth(refreshResponse.access_token, refreshResponse.user)
                setUser(refreshResponse.user)
              }
            } catch (refreshError) {
              if (!isCancelled) {
                authUtils.clearAuth()
                setUser(null)
              }
            }
          }
        } else {
          // Skip refresh attempt if user just logged out
          const lastLogout = sessionStorage.getItem('lastLogout')
          const now = Date.now()
          if (lastLogout && now - parseInt(lastLogout) < 5000) {
            // If logout happened within last 5 seconds, skip refresh
            if (!isCancelled) {
              setUser(null)
            }
            return
          }

          // Only try to restore session if we might have a refresh token cookie
          try {
            const refreshResponse = await apiService.refreshToken()
            if (!isCancelled) {
              authUtils.setAuth(refreshResponse.access_token, refreshResponse.user)
              setUser(refreshResponse.user)
            }
          } catch (error) {
            // No active session - this is expected for new visitors (silently ignore)
            if (!isCancelled) {
              setUser(null)
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (!isCancelled) {
          setUser(null)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      isCancelled = true
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiService.login({ email, password })
    authUtils.setAuth(response.access_token, response.user)
    setUser(response.user)
  }

  const register = async (email: string, password: string, name: string) => {
    const response = await apiService.register({ email, password, name, role: 'user' })
    authUtils.setAuth(response.access_token, response.user)
    setUser(response.user)
  }

  const logout = () => {
    authUtils.clearAuth()
    setUser(null)
    // Mark logout time to prevent immediate refresh attempt
    sessionStorage.setItem('lastLogout', Date.now().toString())
    router.push('/login')
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
