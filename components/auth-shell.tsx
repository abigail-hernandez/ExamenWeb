import Link from "next/link"
import { Ticket } from "lucide-react"

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Panel de marca */}
      <div className="relative flex flex-col justify-between bg-primary p-8 text-primary-foreground lg:w-1/2 lg:p-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary-foreground text-primary">
            <Ticket className="size-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">Boletera</span>
        </Link>
        <div className="hidden lg:block">
          <h2 className="max-w-md text-balance text-4xl font-bold leading-tight tracking-tight">
            Tus boletos para los mejores eventos, en un solo lugar.
          </h2>
          <p className="mt-4 max-w-sm text-pretty leading-relaxed text-primary-foreground/70">
            Conciertos, conferencias y espectáculos. Elige tu zona y asegura tu
            lugar.
          </p>
        </div>
        <p className="font-mono text-xs text-primary-foreground/50">
          Examen Web 2 · Sistema de eventos
        </p>
      </div>

      {/* Formulario */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
