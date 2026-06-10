"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button, Field, Input, Textarea } from "./ui"
import { createEvent } from "@/lib/api"
import { useToast } from "./toast"
import { toDateTimeLocal } from "@/lib/utils"

interface ZoneRow {
  key: string
  name: string
  price: string
  totalCapacity: string
}

const PRESETS = ["VIP", "Preferente", "General"]

function newZone(name = ""): ZoneRow {
  return { key: crypto.randomUUID(), name, price: "", totalCapacity: "" }
}

export function EventForm({ onCreated }: { onCreated: () => void }) {
  const { notify } = useToast()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(toDateTimeLocal())
  const [venue, setVenue] = useState("")
  const [zones, setZones] = useState<ZoneRow[]>([newZone("VIP"), newZone("General")])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateZone(key: string, patch: Partial<ZoneRow>) {
    setZones((zs) => zs.map((z) => (z.key === key ? { ...z, ...patch } : z)))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = "Requerido"
    if (!venue.trim()) e.venue = "Requerido"
    if (!date) e.date = "Requerido"
    else if (new Date(date) < new Date()) e.date = "La fecha no puede estar en el pasado"
    if (zones.length === 0) e.zones = "Agrega al menos una zona"
    zones.forEach((z) => {
      if (!z.name.trim()) e[`zone-${z.key}-name`] = "Nombre requerido"
      if (!z.price || Number(z.price) < 0) e[`zone-${z.key}-price`] = "Precio inválido"
      if (!z.totalCapacity || Number(z.totalCapacity) <= 0)
        e[`zone-${z.key}-cap`] = "Cupo inválido"
    })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await createEvent({
        name: name.trim(),
        description: description.trim(),
        date: new Date(date).toISOString(),
        venue: venue.trim(),
        zones: zones.map((z) => ({
          name: z.name.trim(),
          price: Number(z.price),
          totalCapacity: Number(z.totalCapacity),
        })),
      })
      notify("Evento creado correctamente.", "success")
      setName("")
      setDescription("")
      setVenue("")
      setDate(toDateTimeLocal())
      setZones([newZone("VIP"), newZone("General")])
      setErrors({})
      onCreated()
    } catch (err) {
      notify(err instanceof Error ? err.message : "No se pudo crear el evento.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-lg border border-border bg-card p-6"
      noValidate
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight">Nuevo evento</h2>
        <p className="text-sm text-muted-foreground">
          Completa los datos y configura las zonas de boletaje.
        </p>
      </div>

      <Field label="Nombre del evento" htmlFor="ev-name" error={errors.name}>
        <Input
          id="ev-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Concierto de Verano 2026"
        />
      </Field>

      <Field label="Descripción" htmlFor="ev-desc">
        <Textarea
          id="ev-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles del evento..."
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Fecha y hora" htmlFor="ev-date" error={errors.date}>
          <Input
            id="ev-date"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>
        <Field label="Lugar" htmlFor="ev-venue" error={errors.venue}>
          <Input
            id="ev-venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Ej. Auditorio Nacional"
          />
        </Field>
      </div>

      <div className="border-t border-border pt-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-semibold">Zonas de boletaje</p>
            <p className="text-xs text-muted-foreground">
              VIP, Preferente, General u otras con precio y cupo.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setZones((zs) => [...zs, newZone(p)])}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>

        {errors.zones && <p className="mb-2 text-xs text-destructive">{errors.zones}</p>}

        <div className="flex flex-col gap-3">
          {zones.map((z) => (
            <div
              key={z.key}
              className="grid grid-cols-1 gap-2 rounded-md border border-border p-3 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-end"
            >
              <Field label="Zona" htmlFor={`z-name-${z.key}`} error={errors[`zone-${z.key}-name`]}>
                <Input
                  id={`z-name-${z.key}`}
                  value={z.name}
                  onChange={(e) => updateZone(z.key, { name: e.target.value })}
                  placeholder="VIP"
                />
              </Field>
              <Field label="Precio" htmlFor={`z-price-${z.key}`} error={errors[`zone-${z.key}-price`]}>
                <Input
                  id={`z-price-${z.key}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={z.price}
                  onChange={(e) => updateZone(z.key, { price: e.target.value })}
                  placeholder="0.00"
                />
              </Field>
              <Field label="Cupo" htmlFor={`z-cap-${z.key}`} error={errors[`zone-${z.key}-cap`]}>
                <Input
                  id={`z-cap-${z.key}`}
                  type="number"
                  min="1"
                  value={z.totalCapacity}
                  onChange={(e) => updateZone(z.key, { totalCapacity: e.target.value })}
                  placeholder="100"
                />
              </Field>
              <button
                type="button"
                onClick={() => setZones((zs) => zs.filter((x) => x.key !== z.key))}
                className="flex h-11 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive sm:w-11"
                aria-label="Eliminar zona"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setZones((zs) => [...zs, newZone()])}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="size-4" />
          Agregar zona personalizada
        </button>
      </div>

      <Button type="submit" size="lg" loading={loading} className="w-full">
        Crear evento
      </Button>
    </form>
  )
}
