"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthShell } from "@/components/auth-shell"
import { Button, Field, Input } from "@/components/ui"
import { register } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/toast"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const { signIn } = useAuth()
  const { notify } = useToast()
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"Customer" | "Admin">("Customer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!username || !email || !password) {
      setError("Completa todos los campos.")
      return
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }
    setLoading(true)
    try {
      await register(username, email, password, role)
      // Auto inicio de sesión tras registro
      await signIn(email, password)
      notify("Cuenta creada correctamente.", "success")
      router.push(role === "Admin" ? "/admin" : "/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Regístrate para comprar boletos o administrar eventos."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Nombre de usuario" htmlFor="username">
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre"
            autoComplete="username"
          />
        </Field>
        <Field label="Correo electrónico" htmlFor="email">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Contraseña" htmlFor="password">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </Field>

        <Field label="Tipo de cuenta" htmlFor="role">
          <div className="grid grid-cols-2 gap-2" id="role">
            {(["Customer", "Admin"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-md border px-3 py-2.5 text-sm font-medium transition-colors",
                  role === r
                    ? "border-foreground bg-secondary text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/40",
                )}
              >
                {r === "Customer" ? "Cliente" : "Administrador"}
              </button>
            ))}
          </div>
        </Field>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </AuthShell>
  )
}
