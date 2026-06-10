"use client"

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "info"
interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, type, message }])
      setTimeout(() => remove(id), 4500)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "flex items-start gap-3 rounded-md border bg-card p-4 shadow-lg",
              t.type === "success" && "border-success/40",
              t.type === "error" && "border-destructive/40",
              t.type === "info" && "border-border",
            )}
          >
            {t.type === "success" && (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
            )}
            {t.type === "error" && (
              <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
            )}
            {t.type === "info" && (
              <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            )}
            <p className="flex-1 text-sm leading-relaxed text-card-foreground">
              {t.message}
            </p>
            <button
              onClick={() => remove(t.id)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Cerrar notificación"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider")
  return ctx
}
