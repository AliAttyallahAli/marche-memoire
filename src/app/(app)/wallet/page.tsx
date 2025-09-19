
"use client"

import * as React from "react"
import QRCode from "qrcode.react"

import { allTransactions } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { useUser } from "@/context/user-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function WalletPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(user.walletKey);
    toast({
      title: "Copié !",
      description: "L'adresse de votre portefeuille a été copiée dans le presse-papiers.",
    });
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Mon Portefeuille</CardTitle>
          <CardDescription>
            Votre portefeuille de tokens personnel pour toutes les transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Solde Total</p>
              <p className="text-2xl font-bold">
                {user.tokenBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD ')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/transactions">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Envoyer
                </Link>
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
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique du Portefeuille</CardTitle>
          <CardDescription>
            Un relevé complet des transactions de votre portefeuille.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Transaction</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden sm:table-cell">Statut</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead className="text-right">Montant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-xs max-w-[80px] truncate">{transaction.id}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={transaction.type === 'Purchase' || transaction.type === 'Withdrawal' ? 'destructive' : 'secondary'} className="capitalize">
                      {transaction.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant={transaction.status === 'Completed' ? 'default' : (transaction.status === 'Pending' ? 'outline' : 'destructive')}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{transaction.date}</TableCell>
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
