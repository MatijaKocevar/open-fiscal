"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUI } from "@/stores/ui"

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/pos", label: "POS", icon: "🛒" },
  { href: "/invoices", label: "Invoices", icon: "🧾" },
  { href: "/products", label: "Products", icon: "📦" },
  { href: "/customers", label: "Customers", icon: "👥" },
  { href: "/schedule", label: "Schedule", icon: "📅" },
  { href: "/reports", label: "Reports", icon: "📈" },
  { href: "/admin", label: "Settings", icon: "⚙️" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUI()
  const { data: session } = useSession()

  if (pathname === "/login" || pathname === "/setup") return null

  if (!sidebarOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-2 top-2 z-50"
        onClick={toggleSidebar}
      >
        ☰
      </Button>
    )
  }

  return (
    <aside className="w-56 border-r bg-muted/30 p-3 flex flex-col gap-1">
      <div className="flex items-center justify-between px-2 py-2">
        <span className="font-semibold text-sm">DPR Fiscal</span>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-7 w-7">
          ✕
        </Button>
      </div>
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors",
                pathname === item.href && "bg-accent font-medium"
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
      {session?.user && (
        <div className="border-t pt-2 px-2 text-xs text-muted-foreground">
          <p className="truncate">{session.user.email}</p>
          <button onClick={() => signOut()} className="text-primary hover:underline mt-1">
            Sign out
          </button>
        </div>
      )}
    </aside>
  )
}
