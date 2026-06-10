"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Minus, Plus, X, CheckCircle2 } from "lucide-react"
import type { EventResponse, ZoneResponse } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { purchaseTickets } from "@/lib/api"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge, Button } from "./ui"
import { useToast } from "./toast"

export function PurchaseDialog({
  event,
  onClose,
  onPurchased,
}: {
  event: EventResponse
  onClose: () => void
  onPurchased?: () => void
}) {
  const { user } = useAuth()
  const { notify } = useToast()
  const router = useRouter()

  const availableZones = event.zones
  const [zoneId, setZoneId] = useState<string>(
    availableZones.find((z) => z.availableTickets > 0)?.id ?? availableZones[0]?.id ?? "",
  )
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<null | { total: number; zone: string; qty: number }>(null)

  const zone: ZoneResponse | undefined = useMemo(
    () => availableZones.find((z) => z.id === zoneId),
    [availableZones, zoneId],
  )

  const maxQty = zone ? Math.min(zone.availableTickets, 10) : 1
  const total = zone ? zone.price * quantity : 0

  useEffect(() => {
    setQuantity(1)
  }, [zoneId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  async function handlePurchase() {
    if (!user) {
      router.push("/login")
      return
    }
    if (!zone) return
    setLoading(true)
    try {
      const res = await purchaseTickets({
        eventId: event.id,
        ticketZoneId: zone.id,
        userId: user.id,
        quantity,
      })
      setDone({ total: res.totalPrice, zone: res.zoneName, qty: res.quantity })
      onPurchased?.()
    } catch (err) {
      notify(err instanceof Error ? err.message : "No se pudo completar la compra.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-xl border border-border bg-card sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Comprar boletos para ${event.name}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2 className="text-balance text-xl font-bold tracking-tight">{event.name}</h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 capitalize">
                <Calendar className="size-4" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {event.venue}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <CheckCircle2 className="size-14 text-success" />
            <div>
              <h3 className="text-lg font-bold">¡Compra confirmada!</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {done.qty} {done.qty === 1 ? "boleto" : "boletos"} · Zona {done.zone}
              </p>
            </div>
            <p className="font-mono text-2xl font-bold">{formatCurrency(done.total)}</p>
            <Button onClick={onClose} className="w-full" size="lg">
              Listo
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Selecciona zona
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {availableZones.map((z) => {
                  const sold = z.availableTickets <= 0
                  const selected = z.id === zoneId
                  return (
                    <button
                      key={z.id}
                      disabled={sold}
                      onClick={() => setZoneId(z.id)}
                      className={[
                        "flex items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors",
                        selected
                          ? "border-foreground bg-secondary"
                          : "border-border hover:border-foreground/40",
                        sold ? "cursor-not-allowed opacity-50" : "",
                      ].join(" ")}
                    >
                      <div>
                        <p className="font-semibold">{z.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {sold ? "Agotado" : `${z.availableTickets} disponibles`}
                        </p>
                      </div>
                      <span className="font-mono font-bold">{formatCurrency(z.price)}</span>
                    </button>
                  )
                })}
              </div>

              {zone && zone.availableTickets > 0 && (
                <div className="mt-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Cantidad
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex size-11 items-center justify-center text-foreground disabled:opacity-40"
                        aria-label="Disminuir"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-12 text-center font-mono text-lg font-bold">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                        disabled={quantity >= maxQty}
                        className="flex size-11 items-center justify-center text-foreground disabled:opacity-40"
                        aria-label="Aumentar"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Máximo {maxQty} por compra
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Total
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {zone ? `${formatCurrency(zone.price)} × ${quantity}` : "—"}
                  </p>
                </div>
                <p className="text-2xl font-bold tracking-tight">{formatCurrency(total)}</p>
              </div>
              {!user && (
                <p className="mb-3 rounded-md bg-secondary px-3 py-2 text-center text-xs text-muted-foreground">
                  Debes iniciar sesión para completar la compra.
                </p>
              )}
              <Button
                variant="accent"
                size="lg"
                className="w-full"
                loading={loading}
                disabled={!zone || zone.availableTickets <= 0}
                onClick={handlePurchase}
              >
                {user ? "Confirmar compra" : "Iniciar sesión para comprar"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
