
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
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

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
import { Badge } from "./ui/badge"

function TimeAgo({ timestamp }: { timestamp: string }) {
    const [timeAgo, setTimeAgo] = React.useState('');
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        const calculateTimeAgo = () => {
            const now = new Date();
            const past = new Date(timestamp);
            const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

            if (seconds < 60) return "À l'instant";
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `Il y a ${minutes} min`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `Il y a ${hours} h`;
            const days = Math.floor(hours / 24);
            return `Il y a ${days} j`;
        };
        setTimeAgo(calculateTimeAgo());

        const interval = setInterval(() => {
            setTimeAgo(calculateTimeAgo());
        }, 60000); // Mettre à jour toutes les minutes

        return () => clearInterval(interval);
    }, [timestamp]);
    
    if (!isMounted) return null;

    return <>{timeAgo}</>;
}


export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, notifications, markNotificationsAsRead, setUser } = useUser()
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    setUser(null)
    router.push('/login')
  }

  if (!user) {
    // This shouldn't really happen if the layout protection is working, but as a fallback.
    return null;
  }

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

  const navLinks = user?.role ? allNavLinks.filter(link => link.roles.includes(user.role)) : [];


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
        <nav className="hidden">
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
         <DropdownMenu onOpenChange={(open) => { if (open) markNotificationsAsRead() }}>
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
              notifications.slice(0, 5).map((notif) => (
                <DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-2">
                  {!notif.read && <Circle className="h-2 w-2 mt-1.5 fill-primary text-primary" />}
                  <div className={cn("grid gap-1", notif.read && "pl-5")}>
                    <p className="font-semibold">{notif.title}</p>
                    <p className="text-sm text-muted-foreground">{notif.description}</p>
                    <p className="text-xs text-muted-foreground">
                        <TimeAgo timestamp={notif.timestamp} />
                    </p>
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
                    <AvatarImage src={user?.avatar} alt={user?.name} data-ai-hint="user avatar" />
                    <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
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
            <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />Déconnexion
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                  <span className="sr-only">ZOUDOU</span>
                  </Link>
                  {navLinks.map((link) => (
                      <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsSheetOpen(false)}
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
