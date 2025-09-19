
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/context/user-context"
import { ArrowRight } from "lucide-react"

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Le nom complet doit comporter au moins 2 caractères."),
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
})

export default function ProfilePage() {
  const { toast } = useToast()
  const { user } = useUser()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user.name,
      email: user.email,
    },
  })

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    toast({
      title: "Profil Mis à Jour",
      description: "Vos informations de profil ont été enregistrées.",
    })
  }
  
  const kycStatusVariant = {
    Verified: 'default',
    Pending: 'secondary',
    Rejected: 'destructive',
    'Not Submitted': 'outline',
  } as const

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-1 flex flex-col gap-8">
        <Card>
          <CardHeader className="items-center">
            <Avatar className="w-24 h-24 mb-2">
                <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
             <div className="flex justify-between items-center">
                <span>Statut KYC</span>
                <Badge variant={kycStatusVariant[user.kycStatus]}>{user.kycStatus}</Badge>
            </div>
            <div className="flex justify-between items-center">
                <span>Solde de Tokens</span>
                <span className="font-semibold">{user.tokenBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD ')}</span>
            </div>
          </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Devenir Vendeur</CardTitle>
                <CardDescription>
                Vous avez des produits ou services à proposer ? Lancez-vous sur la marketplace.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/vendor">
                        Accéder au tableau de bord vendeur
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
      <div className="md:col-span-2 grid gap-8 content-start">
        <Card>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <CardHeader>
                <CardTitle>Informations du Profil</CardTitle>
                <CardDescription>Mettez à jour vos données personnelles ici.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom Complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre nom complet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Votre e-mail" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit">Enregistrer les Modifications</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
