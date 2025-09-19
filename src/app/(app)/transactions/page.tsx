
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { allTransactions } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const p2pTransferSchema = z.object({
  recipient: z.string().min(10, "L'adresse du destinataire est requise."),
  amount: z.coerce.number().positive("Le montant doit être supérieur à zéro."),
})

export default function P2PPage() {
  const { toast } = useToast()
  const p2pTransactions = allTransactions.filter(t => t.type === 'Purchase' || t.type === 'Withdrawal')


  const form = useForm<z.infer<typeof p2pTransferSchema>>({
    resolver: zodResolver(p2pTransferSchema),
    defaultValues: {
      recipient: "",
      amount: 0,
    },
  })

  function onSubmit(values: z.infer<typeof p2pTransferSchema>) {
    console.log(values)
    toast({
      title: "Transfert Réussi !",
      description: `Vous avez envoyé ${values.amount} BZD à ${values.recipient.substring(0, 8)}...`,
    })
    form.reset()
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="md:col-span-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Transfert P2P</CardTitle>
              <CardDescription>Envoyez des tokens à un autre utilisateur.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clé de portefeuille du destinataire</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
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
                    <FormLabel>Montant (BZD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Envoyer les Tokens
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Historique des Transferts P2P</CardTitle>
          <CardDescription>
            Consultez vos transactions P2P récentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {p2pTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground hidden sm:block">
                      {transaction.date}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
