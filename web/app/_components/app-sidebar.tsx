"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUI } from "@/stores/ui"

const navItems = [
  { href: "/", label: "Nadzorna plošča", icon: "📊" },
  { href: "/pos", label: "Blagajna", icon: "🛒" },
  { href: "/invoices", label: "Računi", icon: "🧾" },
  { href: "/products", label: "Izdelki", icon: "📦" },
  { href: "/customers", label: "Stranke", icon: "👥" },
  { href: "/schedule", label: "Urnik", icon: "📅" },
  { href: "/reports", label: "Poročila", icon: "📈" },
  { href: "/admin", label: "Nastavitve", icon: "⚙️" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar } = useUI()

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
      <nav className="flex flex-col gap-0.5">
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
    </aside>
  )
}
