
import {
  Users,
  CircleDollarSign,
  ShoppingBag,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

import { allUsers, allTransactions } from "@/lib/data"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminPage() {
    const totalTokens = allUsers.reduce((sum, user) => sum + user.tokenBalance, 0)
    const marketplaceVolume = allTransactions.filter(t => t.type === 'Purchase').reduce((sum, t) => sum - t.amount, 0)

    const kycStatusVariant = {
        Verified: 'default',
        Pending: 'secondary',
        Rejected: 'destructive',
        'Not Submitted': 'outline',
    } as const

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Admin</h1>
                <p className="text-muted-foreground">
                    Un aperçu de l'ensemble de la plateforme.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allUsers.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Nombre d'utilisateurs enregistrés
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total des Tokens Émis</CardTitle>
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTokens.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD').replace(',', '.')}</div>
                        <p className="text-xs text-muted-foreground">
                            Total des tokens pour tous les utilisateurs
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Volume de la Marketplace</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{marketplaceVolume.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD').replace(',', '.')}</div>
                         <p className="text-xs text-muted-foreground">
                            Valeur totale des produits vendus
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>Gestion des Utilisateurs</CardTitle>
                        <CardDescription>Affichez et gérez tous les utilisateurs de la plateforme.</CardDescription>
                    </div>
                    <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="#">
                            Gérer les Vérifications
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead className="hidden sm:table-cell">Rôle</TableHead>
                                <TableHead className="hidden sm:table-cell">Statut KYC</TableHead>
                                <TableHead className="text-right">Solde de Tokens</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allUsers.map((user) => (
                                <TableRow key={user.walletKey}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant={kycStatusVariant[user.kycStatus]}>{user.kycStatus}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {user.tokenBalance.toLocaleString('fr-FR', { style: 'currency', currency: 'USD' }).replace('USD', 'BZD').replace(',', '.')}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                                                <DropdownMenuItem>Suspendre</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
