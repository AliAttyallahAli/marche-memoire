"use client"

import {
  Bell,
  Home,
  ShoppingBag,
  Wallet,
  BarChart3,
  UserCog,
  Pickaxe,
  User,
  LogOut,
  Menu,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Logo } from "./logo"

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
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/mining", label: "Mining", icon: Pickaxe },
    { href: "/wallet", label: "My Wallet", icon: Wallet },
    { href: "/transactions", label: "Transactions", icon: BarChart3 },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  ]

  if (user.role === 'admin') {
    navLinks.push({ href: "/admin", label: "Admin Panel", icon: UserCog })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
       <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo />
          <span className="sr-only">N+</span>
        </Link>
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
        <Sheet>
            <SheetTrigger asChild>
            <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
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
                        "hover:text-foreground",
                        isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                    )}
                    >
                    {link.label}
                    </Link>
                ))}
            </nav>
            </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="@username" data-ai-hint="user avatar" />
                        <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/login"><LogOut className="mr-2 h-4 w-4" />Logout</Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    </header>
  )
}
