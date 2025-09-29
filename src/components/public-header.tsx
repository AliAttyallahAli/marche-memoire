
"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function PublicHeader() {
    const pathname = usePathname();

    const navLinks = [
    ]

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo />
                <span className="hidden sm:inline-block">ZOUDOU</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
                {navLinks.map(link => (
                    <Link 
                        key={link.href}
                        href={link.href} 
                        className={cn(
                            "transition-colors hover:text-foreground",
                            pathname === link.href ? "text-foreground" : "text-muted-foreground"
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" asChild>
                    <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild>
                    <Link href="/register">S'inscrire</Link>
                </Button>
            </div>
        </header>
    )
}
