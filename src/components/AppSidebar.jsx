"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Home, ShoppingBag, Palette, Images, Info, Mail } from "lucide-react"
import { siteConfig } from "@/lib/site"

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/custom", label: "Custom", icon: Palette },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
]

export default function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-white border-r border-black/10">
      <SidebarHeader className="px-3 py-4">
        <Link href="/" className="font-extrabold tracking-wide text-base">
          {siteConfig.wordmark}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} className="data-[active=true]:bg-black/5">
                      <Link href={item.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 text-xs text-black/60">
        Handmade studio in Ohio
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
