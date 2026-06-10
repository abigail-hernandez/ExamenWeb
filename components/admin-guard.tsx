"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "./ui"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
    } else if (!isAdmin) {
      router.replace("/")
    }
  }, [loading, user, isAdmin, router])

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
        <Spinner className="size-7" />
        <p className="text-sm">Verificando acceso...</p>
      </div>
    )
  }

  return <>{children}</>
}
