"use client"

import { useCallback, useEffect, useState } from "react"
import { Calendar, MapPin, RefreshCw } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AdminGuard } from "@/components/admin-guard"
import { EventForm } from "@/components/event-form"
import { Badge, Spinner } from "@/components/ui"
import { getEvents } from "@/lib/api"
import type { EventResponse } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

function EventsTable() {
  const [events, setEvents] = useState<EventResponse[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setEvents(await getEvents())
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div>
        <EventForm onCreated={load} />
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Eventos publicados</h2>
            <p className="text-sm text-muted-foreground">
              {events.length} {events.length === 1 ? "evento activo" : "eventos activos"}
            </p>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RefreshCw className="size-4" />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <Spinner />
            <p className="text-sm">Cargando...</p>
          </div>
        ) : events.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Aún no hay eventos. Crea el primero con el formulario.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((ev) => {
              const sold = ev.zones.reduce((s, z) => s + z.ticketsSold, 0)
              const cap = ev.zones.reduce((s, z) => s + z.totalCapacity, 0)
              const pct = cap > 0 ? Math.round((sold / cap) * 100) : 0
              return (
                <li key={ev.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold leading-tight">{ev.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 capitalize">
                          <Calendar className="size-4" />
                          {formatDate(ev.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-4" />
                          {ev.venue}
                        </span>
                      </div>
                    </div>
                    <Badge variant={ev.isActive ? "success" : "danger"}>
                      {ev.isActive ? "Activo" : "Cancelado"}
                    </Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {ev.zones.map((z) => (
                      <div
                        key={z.id}
                        className="rounded-md border border-border px-3 py-1.5 text-xs"
                      >
                        <span className="font-semibold">{z.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {formatCurrency(z.price)} · {z.ticketsSold}/{z.totalCapacity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-mono uppercase tracking-wider">Ocupación</span>
                      <span>
                        {sold}/{cap} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Panel de administración
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Gestión de eventos</h1>
          </div>
          <EventsTable />
        </main>
      </div>
    </AdminGuard>
  )
}
