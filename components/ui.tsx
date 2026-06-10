import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react"

type Variant = "primary" | "outline" | "ghost" | "accent" | "destructive"
type Size = "sm" | "md" | "lg"

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50",
  accent:
    "bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-secondary disabled:opacity-50",
  ghost: "bg-transparent text-foreground hover:bg-secondary disabled:opacity-50",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50",
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: React.ReactNode
}

export function Field({ label, htmlFor, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20",
        className,
      )}
      {...props}
    />
  )
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20",
        className,
      )}
      {...props}
    />
  )
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-muted-foreground", className)} />
}

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode
  variant?: "neutral" | "success" | "danger" | "accent"
  className?: string
}) {
  const styles = {
    neutral: "bg-secondary text-secondary-foreground",
    success: "bg-success/15 text-success",
    danger: "bg-destructive/15 text-destructive",
    accent: "bg-accent/20 text-accent-foreground",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs uppercase tracking-wider",
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
