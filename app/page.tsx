"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Search, CalendarX2, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { EventCard } from "@/components/event-card"
import { PurchaseDialog } from "@/components/purchase-dialog"
import { Spinner } from "@/components/ui"
import { getEvents } from "@/lib/api"
import type { EventResponse } from "@/lib/types"

export default function HomePage() {
  const [events, setEvents] = useState<EventResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [active, setActive] = useState<EventResponse | null>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (term?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getEvents(term)
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar eventos.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function onSearchChange(value: string) {
    setSearch(value)
    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => load(value.trim() || undefined), 350)
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1 font-mono text-xs uppercase tracking-wider text-primary-foreground/70">
            <Sparkles className="size-3.5" />
            Conciertos · Conferencias · Espectáculos
          </span>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Vive los eventos que no te puedes perder.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-primary-foreground/70">
            Explora eventos activos, elige tu zona y compra tus boletos en segundos.
            VIP, Preferente o General — tú decides.
          </p>

          <div className="mt-10 max-w-xl">
            <div className="flex items-center gap-3 rounded-md border border-primary-foreground/20 bg-primary-foreground/5 px-4 focus-within:border-primary-foreground/50">
              <Search className="size-5 text-primary-foreground/60" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Busca por nombre o descripción..."
                className="h-12 w-full bg-transparent text-base text-primary-foreground outline-none placeholder:text-primary-foreground/40"
                aria-label="Buscar eventos"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Listado */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {search ? "Resultados" : "Eventos activos"}
          </h2>
          {!loading && !error && (
            <span className="font-mono text-sm text-muted-foreground">
              {events.length} {events.length === 1 ? "evento" : "eventos"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
            <Spinner className="size-7" />
            <p className="text-sm">Cargando eventos...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-20 text-center">
            <CalendarX2 className="size-10 text-destructive" />
            <p className="max-w-md text-sm text-destructive">{error}</p>
            <button
              onClick={() => load(search.trim() || undefined)}
              className="mt-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Reintentar
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-24 text-center">
            <CalendarX2 className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {search
                ? "No encontramos eventos que coincidan con tu búsqueda."
                : "No hay eventos activos por el momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onBuy={setActive} />
            ))}
          </div>
        )}
      </main>

      {active && (
        <PurchaseDialog
          event={active}
          onClose={() => setActive(null)}
          onPurchased={() => load(search.trim() || undefined)}
        />
      )}

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 text-center font-mono text-xs text-muted-foreground sm:px-6">
          Boletera · Sistema de venta de boletos · Examen Web 2
        </div>
      </footer>
    </div>
  )
}
