"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface User {
  username: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS = [
  { username: "admin", password: "admin123", name: "Administrador", role: "Admin" },
  { username: "demo", password: "demo123", name: "Usuario Demo", role: "Vendedor" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback((username: string, password: string): boolean => {
    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      setUser({ username: found.username, name: found.name, role: found.role })
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
