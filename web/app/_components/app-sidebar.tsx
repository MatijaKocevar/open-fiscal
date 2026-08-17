"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const { data: session } = useSession()
  const isOwner = session?.user?.role === "OWNER"

  const baseNav: NavMainItem[] = [
    { title: t("dashboard"), url: "/", icon: LayoutDashboard },
    {
      title: t("sales"),
      url: "/pos",
      icon: ShoppingCart,
      items: [
        { title: t("pos"), url: "/pos" },
        { title: t("invoices"), url: "/invoices" },
        { title: t("customers"), url: "/customers" },
      ],
    },
    {
      title: t("catalog"),
      url: "/products",
      icon: Package,
      items: [
        { title: t("products"), url: "/products" },
        { title: t("newProduct"), url: "/products/new" },
      ],
    },
    {
      title: t("operations"),
      url: "/schedule",
      icon: CalendarDays,
      items: [
        { title: t("schedule"), url: "/schedule" },
        { title: t("reports"), url: "/reports" },
      ],
    },
  ]

  const navMain: NavMainItem[] = [
    ...baseNav,
    {
      title: t("settings"),
      url: "/admin",
      icon: Settings,
      items: isOwner
        ? [
            { title: t("general"), url: "/admin" },
            { title: t("users"), url: "/admin/users" },
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
                <span className="truncate text-xs">{t("invoicing")}</span>
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
