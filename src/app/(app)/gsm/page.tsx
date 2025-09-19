
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Smartphone } from "lucide-react"

const gsmExchangeSchema = z.object({
  operator: z.string({ required_error: "Veuillez sélectionner un opérateur." }),
  phoneNumber: z.string().min(8, "Le numéro de téléphone est invalide."),
  amount: z.coerce.number().positive("Le montant doit être supérieur à zéro."),
})

export default function GsmPage() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof gsmExchangeSchema>>({
    resolver: zodResolver(gsmExchangeSchema),
    defaultValues: {
      operator: undefined,
      phoneNumber: "",
    },
  })

  function onSubmit(values: z.infer<typeof gsmExchangeSchema>) {
    console.log(values)
    toast({
      title: "Échange Réussi !",
      description: `Vous avez rechargé ${values.amount} BZD de crédit pour le numéro ${values.phoneNumber}.`,
    })
    form.reset()
  }

  return (
    <div className="max-w-2xl mx-auto">
        <Card>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Échange BZD vers Crédit GSM</CardTitle>
                    <CardDescription>
                        Rechargez votre téléphone en utilisant votre solde de tokens BZD.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                    control={form.control}
                    name="operator"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Opérateur Mobile</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre opérateur" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="orange">Orange</SelectItem>
                                <SelectItem value="mtn">MTN</SelectItem>
                                <SelectItem value="moov">Moov</SelectItem>
                                <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Numéro de téléphone</FormLabel>
                            <FormControl>
                            <Input type="tel" placeholder="Ex: 0123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Montant à échanger (BZD)</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                            </FormControl>
                            <FormDescription>
                                Le montant sera déduit de votre solde de tokens.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Confirmer la Recharge
                    </Button>
                </CardFooter>
            </form>
            </Form>
        </Card>
    </div>
  )
}
