
"use client"

import * as React from "react"
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
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { allUsers } from "@/lib/data"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("aliattyallahali@gmail.com")
  const [password, setPassword] = React.useState("080931317")


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, you'd have better auth. For now, we find a user by email.
    const foundUser = allUsers.find(u => u.email === email);

    if (foundUser) {
        setUser(foundUser);
        toast({
            title: "Connexion réussie",
            description: `Bienvenue, ${foundUser.name} !`,
        });

        if (foundUser.role === 'admin') {
            router.push('/admin')
        } else if (foundUser.role === 'vendor') { 
            router.push('/vendor')
        } else {
            router.push('/dashboard')
        }
    } else {
        toast({
            variant: "destructive",
            title: "Échec de la connexion",
            description: "Adresse e-mail ou mot de passe incorrect.",
        });
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                          <span className="sr-only">{showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}</span>
                        </Button>
                      </div>
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
