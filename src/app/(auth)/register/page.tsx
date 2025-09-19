import Link from "next/link"
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

export default function RegisterPage() {
  return (
     <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-8">
            <Logo />
        </div>
        <Card>
        <CardHeader>
            <CardTitle className="text-xl">S'inscrire</CardTitle>
            <CardDescription>
            Entrez vos informations pour créer un compte
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="full-name">Nom complet</Label>
                    <Input id="full-name" placeholder="Alex Johnson" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="referral-code">Code de parrainage (Optionnel)</Label>
                    <Input id="referral-code" placeholder="REF12345" />
                </div>
                <Button type="submit" className="w-full" asChild>
                    <Link href="/dashboard">Créer un compte</Link>
                </Button>
            </div>
            <div className="mt-4 text-center text-sm">
            Vous avez déjà un compte ?{" "}
            <Link href="/login" className="underline">
                Se connecter
            </Link>
            </div>
        </CardContent>
        </Card>
    </div>
  )
}
