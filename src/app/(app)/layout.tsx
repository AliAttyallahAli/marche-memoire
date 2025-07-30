"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building,
  LayoutDashboard,
  Users,
  DollarSign,
  CalendarOff,
  Briefcase,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { Header } from "@/components/header"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="p-2">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/dashboard")}
                tooltip="Tableau de bord"
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Tableau de bord</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/personnel")} tooltip="Personnel">
                <Link href="/personnel">
                  <Users />
                  <span>Personnel</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/departements")}
                tooltip="Départements"
              >
                <Link href="/departements">
                  <Building />
                  <span>Départements</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/salaires")} tooltip="Salaires">
                <Link href="/salaires">
                  <DollarSign />
                  <span>Salaires</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/conges")} tooltip="Congés">
                <Link href="/conges">
                  <CalendarOff />
                  <span>Congés</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/fonctions")} tooltip="Fonctions">
                <Link href="/fonctions">
                  <Briefcase />
                  <span>Fonctions & Services</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
