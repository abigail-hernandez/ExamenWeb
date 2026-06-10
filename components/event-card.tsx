"use client"

import { Calendar, MapPin, Ticket } from "lucide-react"
import type { EventResponse } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge, Button } from "./ui"

export function EventCard({
  event,
  onBuy,
}: {
  event: EventResponse
  onBuy: (event: EventResponse) => void
}) {
  const prices = event.zones.map((z) => z.price)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const totalAvailable = event.zones.reduce((s, z) => s + z.availableTickets, 0)
  const soldOut = totalAvailable <= 0

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/30">
      <div className="flex items-start justify-between gap-3 border-b border-border p-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-balance text-lg font-bold leading-tight tracking-tight">
            {event.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {event.description}
          </p>
        </div>
        {soldOut ? (
          <Badge variant="danger">Agotado</Badge>
        ) : (
          <Badge variant="success">Activo</Badge>
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4 shrink-0" />
          <span className="capitalize">{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          <span className="truncate">{event.venue}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Ticket className="size-4 shrink-0" />
          <span>
            {event.zones.length} {event.zones.length === 1 ? "zona" : "zonas"} ·{" "}
            {totalAvailable} disponibles
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-border p-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Desde
          </p>
          <p className="text-xl font-bold tracking-tight">
            {formatCurrency(minPrice)}
          </p>
        </div>
        <Button
          variant="accent"
          onClick={() => onBuy(event)}
          disabled={soldOut}
        >
          {soldOut ? "Sin cupo" : "Comprar"}
        </Button>
      </div>
    </article>
  )
}
