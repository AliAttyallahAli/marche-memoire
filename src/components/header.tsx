
"use client"

import {
  Bell,
  Home,
  ShoppingBag,
  Wallet,
  Send,
  UserCog,
  Pickaxe,
  User,
  LogOut,
  Menu,
  Store
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

export function Header() {
  const pathname = usePathname()
  const { user } = useUser()

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  const navLinks = [
    { href: "/dashboard", label: "Tableau de Bord", icon: Home },
    { href: "/mining", label: "Minage", icon: Pickaxe },
    { href: "/wallet", label: "Mon Portefeuille", icon: Wallet },
    { href: "/transactions", label: "P2P", icon: Send },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
    { href: "/vendor", label: "Tableau de bord Vendeur", icon: Store },
  ]

  if (user.role === 'admin') {
    navLinks.push({ href: "/admin", label: "Panneau Admin", icon: UserCog })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        <Logo />
        <span className="hidden sm:inline-block">N+</span>
      </Link>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Voir les notifications</span>
        </Button>
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
                className="shrink-0"
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
                  <span className="sr-only">N+</span>
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
