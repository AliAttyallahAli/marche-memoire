
"use client"

import {
  Bell,
  Home,
  ShoppingBag,
  Wallet,
  Send,
  UserCog,
  User,
  LogOut,
  Menu,
  Store,
  Rss,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Circle,
  FileText
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Logo } from "./logo"
import { ThemeToggle } from "./theme-toggle"
import { notifications as initialNotifications } from "@/lib/data"
import { Badge } from "./ui/badge"

export function Header() {
  const pathname = usePathname()
  const { user } = useUser()
  const notifications = initialNotifications
  const unreadCount = notifications.filter(n => !n.read).length

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const allNavLinks = [
    { href: "/dashboard", label: "Tableau de Bord", icon: Home, roles: ['user', 'vendor', 'admin'] },
    { href: "/feed", label: "Feed", icon: Rss, roles: ['user', 'vendor', 'admin'] },
    { href: "/chat", label: "Chat", icon: MessageSquare, roles: ['user', 'vendor', 'admin'] },
    { href: "/wallet", label: "Mon Portefeuille", icon: Wallet, roles: ['user', 'vendor', 'admin'] },
    { href: "/transactions", label: "P2P", icon: Send, roles: ['user', 'vendor', 'admin'] },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag, roles: ['user', 'vendor', 'admin'] },
    { href: "/gsm", label: "GSM", icon: Smartphone, roles: ['user', 'vendor', 'admin'] },
    { href: "/kyc", label: "KYC", icon: ShieldCheck, roles: ['user', 'vendor', 'admin'] },
    { href: "/documents", label: "Documents", icon: FileText, roles: ['user', 'vendor', 'admin'] },
    { href: "/vendor", label: "Tableau de bord Vendeur", icon: Store, roles: ['vendor', 'admin'] },
    { href: "/admin", label: "Panneau Admin", icon: UserCog, roles: ['admin'] },
  ]

  const navLinks = allNavLinks.filter(link => link.roles.includes(user.role));


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Logo />
          <span className="hidden sm:inline-block">ZOUDOU</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <nav className="hidden md:flex md:items-center md:gap-5 lg:gap-6 text-sm font-medium">
             {navLinks.map((link) => (
              <Link
              key={link.href}
              href={link.href}
              className={cn(
                  "transition-colors hover:text-foreground",
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground"
              )}
              >
              {link.label}
              </Link>
          ))}
        </nav>
        <ThemeToggle />
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Voir les notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-2">
                  {!notif.read && <Circle className="h-2 w-2 mt-1.5 fill-primary text-primary" />}
                  <div className={cn("grid gap-1", notif.read && "pl-5")}>
                    <p className="font-semibold">{notif.title}</p>
                    <p className="text-sm text-muted-foreground">{notif.description}</p>
                    <p className="text-xs text-muted-foreground">{notif.timestamp}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Aucune nouvelle notification
              </div>
            )}
             <DropdownMenuSeparator />
             <DropdownMenuItem className="justify-center text-sm text-muted-foreground hover:text-foreground">
               Voir toutes les notifications
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="@username" data-ai-hint="user avatar" />
                    <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <span className="sr-only">Menu utilisateur</span>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile"><User className="mr-2 h-4 w-4" />Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/login"><LogOut className="mr-2 h-4 w-4" />Déconnexion</Link>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu de navigation</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                  <SheetTitle className="sr-only">Menu de Navigation</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium mt-4">
                  <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                  >
                  <Logo />
                  <span className="sr-only">ZOUDOU</span>
                  </Link>
                  {navLinks.map((link) => (
                      <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                          "flex items-center gap-4 px-2.5",
                          isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      >
                       <link.icon className="h-5 w-5" />
                      {link.label}
                      </Link>
                  ))}
              </nav>
            </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
