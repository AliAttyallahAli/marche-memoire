
"use client"

import * as React from "react"
import QRCode from "qrcode.react"

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
import { Copy, ArrowDownLeft, ArrowUpRight, Pickaxe } from "lucide-react"
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
import { CircularProgress } from "@/components/ui/circular-progress"

const TWENTY_FOUR_HOURS_IN_SECONDS = 24 * 60 * 60

export default function WalletPage() {
  const { user, addTokens, transactions } = useUser();
  const { toast } = useToast();
  const [canMine, setCanMine] = React.useState(true)
  const [timeLeft, setTimeLeft] = React.useState(0)


  const handleCopy = () => {
    navigator.clipboard.writeText(user.walletKey);
    toast({
      title: "Copié !",
      description: "L'adresse de votre portefeuille a été copiée dans le presse-papiers.",
    });
  };
  
  const handleMine = () => {
    if (canMine) {
      addTokens(10)
      setCanMine(false)
      setTimeLeft(TWENTY_FOUR_HOURS_IN_SECONDS)

      const nextMineTime = new Date().getTime() + TWENTY_FOUR_HOURS_IN_SECONDS * 1000
      localStorage.setItem("nextMineTime", nextMineTime.toString())

      toast({
        title: "Succès !",
        description: "Vous avez miné 10 BZD avec succès.",
      })
    }
  }
  
  React.useEffect(() => {
    const nextMineTime = localStorage.getItem("nextMineTime")
    if (nextMineTime) {
      const now = new Date().getTime()
      const remainingTime = Math.round((parseInt(nextMineTime) - now) / 1000)
      if (remainingTime > 0) {
        setCanMine(false)
        setTimeLeft(remainingTime)
      }
    }
  }, [])

  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setCanMine(true)
    }
  }, [timeLeft])
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0")
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${h}:${m}:${s}`
  }

  const progress = (1 - timeLeft / TWENTY_FOUR_HOURS_IN_SECONDS) * 100


  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-8 content-start">
            <Card>
                <CardHeader>
                <CardTitle>Mon Portefeuille</CardTitle>
                <CardDescription>
                    Votre portefeuille de tokens personnel pour toutes les transactions et le minage.
                </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-secondary/50 rounded-lg gap-4">
                    <div>
                    <p className="text-sm text-muted-foreground">Solde Total</p>
                    <p className="text-2xl font-bold">
                        {user.tokenBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD ')}
                    </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                    <Button asChild className="flex-1 sm:flex-none">
                        <Link href="/transactions">
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Envoyer
                        </Link>
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 sm:flex-none">
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
                 <div className="text-center p-4 bg-secondary/50 rounded-lg flex flex-col items-center gap-4">
                     <CardTitle className="text-xl font-bold">Minage Quotidien</CardTitle>
                    <CircularProgress value={canMine ? 100 : progress} className="w-32 h-32">
                        {!canMine && (
                            <div className="text-center">
                            <p className="text-muted-foreground text-xs">Prochaine session</p>
                            <p className="text-2xl font-mono font-bold tracking-wider">
                                {formatTime(timeLeft)}
                            </p>
                            </div>
                        )}
                    </CircularProgress>
                    <Button
                        className="w-full max-w-sm"
                        onClick={handleMine}
                        disabled={!canMine}
                    >
                        <Pickaxe className="mr-2 h-5 w-5" />
                        {canMine ? "Démarrer la session de minage" : "Minage en cours"}
                    </Button>
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
                        <TableHead>Détails</TableHead>
                        <TableHead className="hidden sm:table-cell">Type</TableHead>
                        <TableHead className="hidden sm:table-cell">Statut</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                        <TableCell>
                            <div className="font-medium max-w-[120px] sm:max-w-none truncate">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</div>
                        </TableCell>
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

        <div className="lg:col-span-1">
             {/* This column can be used for other content in the future */}
        </div>
    </div>
  )
}
