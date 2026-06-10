import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ToastProvider } from "@/components/toast"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Boletera — Compra boletos para conciertos y eventos",
  description:
    "Plataforma para administrar y vender boletos para conciertos, conferencias y espectáculos. Compra boletos por zona: VIP, Preferente y General.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
