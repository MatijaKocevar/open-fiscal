import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "./_components/app-sidebar"
import "./globals.css"

export const metadata: Metadata = {
  title: "DPR Fiscal",
  description: "DPR Fiscal Invoice Management",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <div className="flex h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  )
}
