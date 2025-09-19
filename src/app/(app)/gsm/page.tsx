
"use client"

import * as React from "react"
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
import { africanMobileOperators } from "@/lib/data"

const gsmExchangeSchema = z.object({
  country: z.string({ required_error: "Veuillez sélectionner un pays." }),
  operator: z.string({ required_error: "Veuillez sélectionner un opérateur." }),
  phoneNumber: z.string().min(8, "Le numéro de téléphone est invalide."),
  amount: z.coerce.number().positive("Le montant doit être supérieur à zéro."),
})

export default function GsmPage() {
  const { toast } = useToast()
  const [availableOperators, setAvailableOperators] = React.useState<string[]>([])

  const form = useForm<z.infer<typeof gsmExchangeSchema>>({
    resolver: zodResolver(gsmExchangeSchema),
    defaultValues: {
      country: undefined,
      operator: undefined,
      phoneNumber: "",
    },
  })
  
  const selectedCountryName = form.watch("country");
  const selectedCountry = africanMobileOperators.find(c => c.country === selectedCountryName);


  const handleCountryChange = (countryName: string) => {
    const countryData = africanMobileOperators.find(c => c.country === countryName)
    setAvailableOperators(countryData ? countryData.operators : [])
    form.setValue("operator", "") 
    form.setValue("country", countryName)
  }

  function onSubmit(values: z.infer<typeof gsmExchangeSchema>) {
    console.log(values)
    toast({
      title: "Échange Réussi !",
      description: `Vous avez rechargé ${values.amount} BZD de crédit pour le numéro ${values.phoneNumber}.`,
    })
    form.reset()
    setAvailableOperators([])
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
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays</FormLabel>
                          <Select onValueChange={handleCountryChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre pays">
                                   {selectedCountry && (
                                    <div className="flex items-center gap-2">
                                      <span>{selectedCountry.flag}</span>
                                      <span>{selectedCountry.country}</span>
                                    </div>
                                  )}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {africanMobileOperators.map((country) => (
                                <SelectItem key={country.country} value={country.country}>
                                  <div className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span>{country.country}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                    control={form.control}
                    name="operator"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Opérateur Mobile</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={availableOperators.length === 0}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre opérateur" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {availableOperators.map((operator) => (
                                    <SelectItem key={operator} value={operator.toLowerCase()}>
                                        {operator}
                                    </SelectItem>
                                ))}
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
