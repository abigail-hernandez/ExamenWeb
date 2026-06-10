"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { clearToken, getToken, login as apiLogin, parseUser, setToken } from "./api"
import type { AuthUser } from "./types"

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      const parsed = parseUser(token)
      if (parsed?.id) setUser(parsed)
      else clearToken()
    }
    setLoading(false)
  }, [])

  async function signIn(email: string, password: string) {
    const { token } = await apiLogin(email, password)
    setToken(token)
    const parsed = parseUser(token)
    if (!parsed?.id) throw new Error("Token inválido recibido del servidor.")
    setUser(parsed)
  }

  function signOut() {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === "Admin",
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
