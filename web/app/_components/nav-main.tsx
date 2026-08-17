"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export type NavMainItem = {
  title: string
  url: string
  icon: LucideIcon
  items?: { title: string; url: string }[]
}

function isActive(pathname: string, url: string) {
  if (url === "/") return pathname === "/"
  return pathname === url || pathname.startsWith(`${url}/`)
}

function subIsActive(
  pathname: string,
  sub: { title: string; url: string },
  siblings: { title: string; url: string }[]
) {
  if (pathname === sub.url) return true
  if (!pathname.startsWith(`${sub.url}/`)) return false
  return !siblings.some((s) => s !== sub && pathname === s.url)
}

function NavItem({ item, pathname }: { item: NavMainItem; pathname: string }) {
  const hasItems = Boolean(item.items?.length)
  const items = item.items ?? []
  const sectionActive = items.some((sub) => subIsActive(pathname, sub, items))
  const [open, setOpen] = React.useState(sectionActive)
  const [prevActive, setPrevActive] = React.useState(sectionActive)

  if (prevActive !== sectionActive) {
    setPrevActive(sectionActive)
    if (sectionActive) {
      setOpen(true)
    }
  }

  if (!hasItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={isActive(pathname, item.url)}
          render={<Link href={item.url} />}
        >
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} render={<SidebarMenuItem />}>
      <SidebarMenuButton tooltip={item.title} render={<Link href={item.url} />}>
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
      <CollapsibleTrigger
        render={<SidebarMenuAction className="data-panel-open:rotate-90" />}
      >
        <ChevronRight />
        <span className="sr-only">Toggle {item.title}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {items.map((sub) => (
            <SidebarMenuSubItem key={sub.title}>
              <SidebarMenuSubButton
                isActive={subIsActive(pathname, sub, items)}
                render={<Link href={sub.url} />}
              >
                <span>{sub.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function NavMain({
  items,
  pathname,
}: {
  items: NavMainItem[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavItem key={item.title} item={item} pathname={pathname} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
