"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  CalendarDays,
  LayoutDashboard,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain, type NavMainItem } from "./nav-main"
import { NavUser } from "./nav-user"

const baseNav: NavMainItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  {
    title: "Sales",
    url: "/pos",
    icon: ShoppingCart,
    items: [
      { title: "POS", url: "/pos" },
      { title: "Invoices", url: "/invoices" },
      { title: "Customers", url: "/customers" },
    ],
  },
  {
    title: "Catalog",
    url: "/products",
    icon: Package,
    items: [
      { title: "Products", url: "/products" },
      { title: "New product", url: "/products/new" },
    ],
  },
  {
    title: "Operations",
    url: "/schedule",
    icon: CalendarDays,
    items: [
      { title: "Schedule", url: "/schedule" },
      { title: "Reports", url: "/reports" },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isOwner = session?.user?.role === "OWNER"

  const navMain: NavMainItem[] = [
    ...baseNav,
    {
      title: "Settings",
      url: "/admin",
      icon: Settings,
      items: isOwner
        ? [
            { title: "General", url: "/admin" },
            { title: "Users", url: "/admin/users" },
          ]
        : undefined,
    },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ReceiptText className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">OpenFiscal</span>
                <span className="truncate text-xs">Invoicing</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        {session?.user ? <NavUser user={session.user} /> : null}
      </SidebarFooter>
    </Sidebar>
  )
}
