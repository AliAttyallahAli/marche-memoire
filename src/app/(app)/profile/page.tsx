
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/context/user-context"
import { ArrowRight, Copy } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Le nom complet doit comporter au moins 2 caractères."),
  email: z.string().email("Veuillez saisir une adresse e-mail valide."),
  civility: z.string().optional(),
  maritalStatus: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  cv: z.any().optional(),
  photo: z.any().optional(),
  parcours: z.string().optional(),
  experience: z.string().optional(),
  loisir: z.string().optional(),
})

export default function ProfilePage() {
  const { toast } = useToast()
  const { user } = useUser()

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user.name,
      email: user.email,
      civility: "",
      maritalStatus: "",
      country: "",
      region: "",
      city: "",
      parcours: "",
      experience: "",
      loisir: "",
    },
  })

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log(values)
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

  const roleVariant = {
    admin: 'default',
    vendor: 'secondary',
    user: 'outline'
  } as const
  
  const referralLink = `https://app.zoudou/register?ref=${user.walletKey.substring(2, 10)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Copié !",
      description: "Le lien de parrainage a été copié dans le presse-papiers.",
    })
  }

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
            <div className="pt-2">
                <Badge variant={roleVariant[user.role]} className="capitalize">{user.role}</Badge>
            </div>
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
                <CardTitle>Lien de Parrainage</CardTitle>
                <CardDescription>
                Partagez ce lien pour inviter de nouveaux membres et gagner des récompenses.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2">
                    <Input
                        value={referralLink}
                        readOnly
                        className="flex-1 font-mono text-xs"
                    />
                    <Button type="button" size="icon" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copier le lien</span>
                    </Button>
                </div>
            </CardContent>
        </Card>

        {user.role !== 'vendor' && user.role !== 'admin' && (
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
        )}
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
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo de profil</FormLabel>
                      <FormControl>
                        <Input type="file" {...profileForm.register("photo")} />
                      </FormControl>
                      <FormDescription>
                        Téléchargez une nouvelle photo de profil.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                 <FormField
                  control={profileForm.control}
                  name="civility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Civilité</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre civilité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monsieur">Monsieur</SelectItem>
                          <SelectItem value="madame">Madame</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={profileForm.control}
                  name="maritalStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>État Civil</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre état civil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="celibataire">Célibataire</SelectItem>
                          <SelectItem value="marie">Marié(e)</SelectItem>
                           <SelectItem value="divorce">Divorcé(e)</SelectItem>
                           <SelectItem value="veuf">Veuf(ve)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={profileForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pays</FormLabel>
                      <FormControl>
                        <Input placeholder="Votre pays" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                      control={profileForm.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Région</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre région" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={profileForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre ville" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                <FormField
                  control={profileForm.control}
                  name="parcours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcours</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Décrivez votre parcours académique et professionnel..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expérience</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Détaillez vos expériences pertinentes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="loisir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loisirs</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Quels sont vos centres d'intérêt ?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={profileForm.control}
                  name="cv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CV</FormLabel>
                      <FormControl>
                        <Input type="file" {...profileForm.register("cv")} />
                      </FormControl>
                      <FormDescription>
                        Téléchargez votre CV au format PDF.
                      </FormDescription>
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
