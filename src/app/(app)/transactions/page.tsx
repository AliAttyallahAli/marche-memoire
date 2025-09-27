
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import QRCode from "qrcode.react"
import { useSearchParams } from "next/navigation"

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
import { Send, ArrowDownLeft, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUser } from "@/context/user-context"
import { Separator } from "@/components/ui/separator"

const p2pTransferSchema = z.object({
  recipient: z.string().min(10, "L'identifiant du destinataire est requis."),
  amount: z.coerce.number().positive("Le montant doit être supérieur à zéro."),
})

function P2PTransferPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const p2pTransactions = allTransactions.filter(t => t.type === 'Purchase' || t.type === 'Withdrawal')
  const searchParams = useSearchParams()


  const form = useForm<z.infer<typeof p2pTransferSchema>>({
    resolver: zodResolver(p2pTransferSchema),
    defaultValues: {
      recipient: "",
      amount: 0,
    },
  })

  React.useEffect(() => {
    const recipientFromQuery = searchParams.get("recipient")
    if (recipientFromQuery) {
      form.setValue("recipient", recipientFromQuery)
    }
  }, [searchParams, form])

  function onSubmit(values: z.infer<typeof p2pTransferSchema>) {
    console.log(values)
    toast({
      title: "Transfert Réussi !",
      description: `Vous avez envoyé ${values.amount} BZD à ${values.recipient.substring(0, 8)}...`,
    })
    form.reset()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(user.walletKey);
    toast({
      title: "Copié !",
      description: "L'adresse de votre portefeuille a été copiée dans le presse-papiers.",
    });
  };

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
              <div className="p-4 rounded-lg bg-muted/50 flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Votre Solde</span>
                  <span className="font-bold text-lg">{user.tokenBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD ')}</span>
              </div>
              <Separator />
              <div className="pt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>N° de carte ou clé de portefeuille du destinataire</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 4022... ou 0x..." {...field} />
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
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit" className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Envoyer les Tokens
              </Button>
               <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowDownLeft className="mr-2 h-4 w-4" />
                    Recevoir
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Recevoir des BZD</DialogTitle>
                    <DialogDescription>
                      Partagez cette adresse ou le QR code pour recevoir des tokens.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                     <div className="p-4 bg-white rounded-lg">
                        <QRCode value={user.walletKey} size={160} />
                     </div>
                    <div className="flex items-center space-x-2 w-full">
                      <Input
                        id="wallet-key"
                        defaultValue={user.walletKey}
                        readOnly
                        className="flex-1 font-mono text-xs"
                      />
                      <Button type="button" size="icon" onClick={handleCopy}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copier l'adresse</span>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
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


export default function P2PPage() {
  return (
    <React.Suspense fallback={<div>Chargement...</div>}>
      <P2PTransferPage />
    </React.Suspense>
  )
}
