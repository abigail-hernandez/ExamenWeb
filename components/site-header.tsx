"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Ticket, LayoutDashboard, CalendarCog, LogOut, Menu, X, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const publicLinks = [{ href: "/", label: "Eventos" }]
  const adminLinks = isAdmin
    ? [
        { href: "/admin", label: "Administrar", icon: CalendarCog },
        { href: "/admin/dashboard", label: "Ventas", icon: LayoutDashboard },
      ]
    : []

  function handleSignOut() {
    signOut()
    setOpen(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Ticket className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">Boletera</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[...publicLinks, ...adminLinks].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <User className="size-4" />
                {user.username}
                {isAdmin && (
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-accent-foreground">
                    Admin
                  </span>
                )}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-4" />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Ingresar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {[...publicLinks, ...adminLinks].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground"
              >
                <LogOut className="size-4" />
                Salir ({user.username})
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
