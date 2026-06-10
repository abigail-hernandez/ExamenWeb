"use client"

import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { DollarSign, Ticket, TrendingUp, Trophy } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AdminGuard } from "@/components/admin-guard"
import { Spinner } from "@/components/ui"
import { getDashboard } from "@/lib/api"
import type { Dashboard } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof DollarSign
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  )
}

function DashboardView() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        setData(await getDashboard())
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar el dashboard.")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
        <Spinner className="size-7" />
        <p className="text-sm">Cargando ventas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 py-16 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const avgTicket =
    data.totalTicketsSoldAllTime > 0
      ? data.totalRevenueAllTime / data.totalTicketsSoldAllTime
      : 0

  const chartData = data.topEvents.map((e) => ({
    name: e.eventName.length > 16 ? e.eventName.slice(0, 15) + "…" : e.eventName,
    fullName: e.eventName,
    ingresos: e.totalRevenue,
    boletos: e.totalTicketsSold,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Ingresos totales"
          value={formatCurrency(data.totalRevenueAllTime)}
          icon={DollarSign}
        />
        <StatCard
          label="Boletos vendidos"
          value={data.totalTicketsSoldAllTime.toLocaleString("es-MX")}
          icon={Ticket}
        />
        <StatCard
          label="Ticket promedio"
          value={formatCurrency(avgTicket)}
          icon={TrendingUp}
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-bold tracking-tight">Ingresos por evento</h2>
        <p className="text-sm text-muted-foreground">Top eventos por recaudación.</p>

        {chartData.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Aún no hay ventas registradas.
          </p>
        ) : (
          <div className="mt-6 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={{ stroke: "var(--border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: "var(--secondary)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--popover-foreground)",
                    fontSize: 13,
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Ingresos"]}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                />
                <Bar dataKey="ingresos" radius={[4, 4, 0, 0]} maxBarSize={64}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="var(--accent)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border p-5">
          <Trophy className="size-5 text-accent-foreground" />
          <h2 className="text-lg font-bold tracking-tight">Ranking de eventos</h2>
        </div>
        {data.topEvents.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Sin datos de ventas.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {data.topEvents.map((e, i) => (
              <li key={e.eventName} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4">
                  <span className="flex size-8 items-center justify-center rounded-md bg-secondary font-mono text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{e.eventName}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.totalTicketsSold} boletos vendidos
                    </p>
                  </div>
                </div>
                <p className="font-mono font-bold">{formatCurrency(e.totalRevenue)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Panel de administración
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard de ventas</h1>
          </div>
          <DashboardView />
        </main>
      </div>
    </AdminGuard>
  )
}
