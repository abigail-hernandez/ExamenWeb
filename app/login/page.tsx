"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { Button, Field, Input } from "@/components/ui"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/toast"

export default function LoginPage() {
  const { signIn } = useAuth()
  const { notify } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!email || !password) {
      setError("Completa todos los campos.")
      return
    }
    setLoading(true)
    try {
      await signIn(email, password)
      notify("Sesión iniciada correctamente.", "success")
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para continuar."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Correo electrónico" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
          />
        </Field>
        <Field label="Contraseña" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Iniciar sesión
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </AuthShell>
  )
}
