"use client"
import { Header } from "@/components/header"
import { UserProvider } from "@/context/user-context"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
            {children}
        </main>
      </div>
    </UserProvider>
  )
}
