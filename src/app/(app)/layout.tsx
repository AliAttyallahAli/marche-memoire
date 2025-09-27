
"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { useUser } from "@/context/user-context"
import { Skeleton } from "@/components/ui/skeleton"

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isMounted } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    if (isMounted && !user) {
      router.push('/login')
    }
  }, [user, isMounted, router])

  if (!isMounted || !user) {
    return (
        <div className="flex flex-col min-h-screen">
         <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-6 w-24 hidden sm:block" />
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
         </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
           <div className="max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-48 w-full" />
           </div>
        </main>
      </div>
    )
  }

  return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-muted/40">
            {children}
        </main>
      </div>
  )
}

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <React.Suspense fallback={<div>Chargement...</div>}>
            <AppLayout>{children}</AppLayout>
        </React.Suspense>
    )
}
