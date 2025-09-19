
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useUser } from "@/context/user-context"

export default function LoginPage() {
  const router = useRouter()
  const { user } = useUser()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would perform authentication here.
    // Based on the authenticated user's role, you redirect.
    if (user.role === 'admin') {
      router.push('/admin')
    } else if (user.role === 'vendor') { // Assuming a 'vendor' role exists
      router.push('/vendor')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Connexion</CardTitle>
                <CardDescription>
                Entrez votre e-mail ci-dessous pour vous connecter à votre compte
                </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      defaultValue={user.email}
                      required
                      />
                  </div>
                  <div className="grid gap-2">
                      <div className="flex items-center">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Link
                          href="#"
                          className="ml-auto inline-block text-sm underline"
                      >
                          Mot de passe oublié ?
                      </Link>
                      </div>
                      <Input id="password" type="password" required defaultValue="password" />
                  </div>
                  <Button type="submit" className="w-full">
                    Se connecter
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Vous n'avez pas de compte ?{" "}
                <Link href="/register" className="underline">
                    S'inscrire
                </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
