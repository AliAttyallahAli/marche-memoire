
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { UploadCloud, FileCheck2, Clock, XCircle } from "lucide-react"

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
import { useUser } from "@/context/user-context"
import { Badge } from "@/components/ui/badge"

const kycFormSchema = z.object({
  documentType: z.string({ required_error: "Veuillez sélectionner un type de document." }),
  documentFront: z.any().refine(files => files?.length == 1, "L'image du recto du document est requise."),
  documentBack: z.any().optional(),
  proofOfAddress: z.any().refine(files => files?.length == 1, "Le justificatif de domicile est requis."),
})

export default function KYCPage() {
  const { toast } = useToast()
  const { user, setUser } = useUser()
  const [showForm, setShowForm] = React.useState(false)

  const form = useForm<z.infer<typeof kycFormSchema>>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      documentType: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof kycFormSchema>) {
    console.log(values)
    setUser(prevUser => ({...prevUser, kycStatus: 'Pending' }))
    toast({
      title: "Documents Soumis",
      description: "Vos documents sont en cours de vérification. Vous serez notifié une fois le processus terminé.",
    })
    setShowForm(false)
  }

  const kycStatusInfo = {
    Verified: {
      icon: <FileCheck2 className="h-12 w-12 text-green-500" />,
      title: "Votre identité est vérifiée",
      description: "Vous avez un accès complet à toutes les fonctionnalités de la plateforme.",
      badgeVariant: "default",
    },
    Pending: {
      icon: <Clock className="h-12 w-12 text-yellow-500" />,
      title: "Vérification en cours",
      description: "Vos documents sont en cours d'examen. Ce processus prend généralement 1 à 2 jours ouvrables.",
      badgeVariant: "secondary",
    },
    Rejected: {
      icon: <XCircle className="h-12 w-12 text-destructive" />,
      title: "Vérification Rejetée",
      description: "Malheureusement, vos documents n'ont pas pu être validés. Veuillez vérifier les exigences et soumettre à nouveau.",
      badgeVariant: "destructive",
    },
    'Not Submitted': {
      icon: <UploadCloud className="h-12 w-12 text-muted-foreground" />,
      title: "Soumettez vos documents",
      description: "Pour accéder à toutes les fonctionnalités, veuillez compléter la vérification de votre identité.",
      badgeVariant: "outline",
    },
  } as const


  const currentStatusInfo = kycStatusInfo[user.kycStatus];
  const needsSubmission = user.kycStatus === 'Not Submitted' || user.kycStatus === 'Rejected'

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
            {currentStatusInfo.icon}
            <CardTitle className="text-2xl mt-4">Vérification KYC</CardTitle>
            <CardDescription>{currentStatusInfo.description}</CardDescription>
             <div className="pt-2">
                <Badge variant={currentStatusInfo.badgeVariant} className="text-sm">
                    Statut Actuel : {user.kycStatus}
                </Badge>
            </div>
        </CardHeader>

        {needsSubmission && !showForm && (
            <CardFooter>
                 <Button className="w-full" onClick={() => setShowForm(true)}>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Soumettre une vérification
                </Button>
            </CardFooter>
        )}

        {needsSubmission && showForm && (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                    <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Type de Document d'Identité</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez un type de document" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="id_card">Carte d'Identité Nationale</SelectItem>
                            <SelectItem value="passport">Passeport</SelectItem>
                            <SelectItem value="drivers_license">Permis de Conduire</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="documentFront"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Recto du Document</FormLabel>
                        <FormControl>
                            <Input type="file" {...form.register("documentFront")} />
                        </FormControl>
                        <FormDescription>
                            Téléchargez une image claire du recto de votre document.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <FormField
                    control={form.control}
                    name="documentBack"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verso du Document (Optionnel)</FormLabel>
                        <FormControl>
                            <Input type="file" {...form.register("documentBack")} />
                        </FormControl>
                        <FormDescription>
                            Téléchargez une image claire du verso, si applicable.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                     <FormField
                    control={form.control}
                    name="proofOfAddress"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Justificatif de Domicile</FormLabel>
                        <FormControl>
                            <Input type="file" {...form.register("proofOfAddress")} />
                        </FormControl>
                        <FormDescription>
                          Facture de services publics, relevé bancaire, etc., datant de moins de 3 mois.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full">
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Soumettre pour Vérification
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={() => setShowForm(false)}>
                        Annuler
                    </Button>
                </CardFooter>
            </form>
            </Form>
        )}
      </Card>
    </div>
  )
}
