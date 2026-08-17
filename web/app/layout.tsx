import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppShell } from "./_components/app-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: "OpenFiscal",
  description: "OpenFiscal invoice management",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <SessionProvider>
          <TooltipProvider>
            <AppShell>{children}</AppShell>
          </TooltipProvider>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
