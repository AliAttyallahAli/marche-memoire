"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  ShoppingBag,
  Wallet,
  Users,
  BarChart3,
  UserCog,
  Pickaxe,
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
import { Badge } from "@/components/ui/badge"
import { user } from "@/lib/data"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    // Exact match for dashboard, startsWith for others
    if (path === "/dashboard") {
      return pathname === path
    }
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
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <Home />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/mining")} tooltip="Mining">
                <Link href="/mining">
                  <Pickaxe />
                  <span>Mining</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/wallet")} tooltip="Wallet">
                <Link href="/wallet">
                  <Wallet />
                  <span>My Wallet</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/transactions")}
                tooltip="Transactions"
              >
                <Link href="/transactions">
                  <BarChart3 />
                  <span>Transactions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/marketplace")} tooltip="Marketplace">
                <Link href="/marketplace">
                  <ShoppingBag />
                  <span>Marketplace</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {user.role === 'admin' && (
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/admin")} tooltip="Admin Panel">
                  <Link href="/admin">
                    <UserCog />
                    <span>Admin Panel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
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
