
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Users,
  CircleDollarSign,
  ShoppingBag,
  MoreVertical,
  ArrowUpRight,
  PlusCircle,
} from "lucide-react"
import Link from "next/link"

import { allUsers as initialUsers } from "@/lib/data"
import type { User } from "@/lib/data"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

const addUserFormSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est requis."),
  email: z.string().email("L'adresse e-mail est invalide."),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
  role: z.enum(["user", "vendor", "admin"]),
  initialBalance: z.coerce.number().min(0, "Le solde doit être positif."),
})

export default function AdminPage() {
    const { toast } = useToast()
    const [open, setOpen] = React.useState(false)
    const [allUsers, setAllUsers] = React.useState<User[]>(initialUsers)

    const totalTokens = allUsers.reduce((sum, user) => sum + user.tokenBalance, 0)
    const marketplaceVolume = 12500 // Assuming a static value for simplicity for now

    const form = useForm<z.infer<typeof addUserFormSchema>>({
        resolver: zodResolver(addUserFormSchema),
        defaultValues: {
          fullName: "",
          email: "",
          password: "",
          role: "user",
          initialBalance: 0,
        },
    })

    function onAddUserSubmit(values: z.infer<typeof addUserFormSchema>) {
        const newUser: User = {
            name: values.fullName,
            email: values.email,
            role: values.role,
            tokenBalance: values.initialBalance,
            avatar: `https://i.pravatar.cc/150?u=${values.email}`,
            walletKey: `0x...${Math.random().toString(16).substr(2, 4)}`,
            kycStatus: 'Not Submitted',
            status: 'offline',
            stories: [],
            cardNumber: `4022${Math.floor(100000000000 + Math.random() * 900000000000).toString().substring(0,12)}`,
        };

        setAllUsers(prevUsers => [newUser, ...prevUsers]);

        toast({
          title: "Utilisateur Ajouté",
          description: `${values.fullName} a été ajouté avec succès.`,
        })
        setOpen(false)
        form.reset()
    }

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
                    <div className="ml-auto flex items-center gap-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1">
                                    Ajouter un Utilisateur
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[480px]">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onAddUserSubmit)} className="space-y-8">
                                        <DialogHeader>
                                            <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                                            <DialogDescription>
                                                Remplissez les détails pour créer un nouveau compte utilisateur.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nom Complet</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="ex: Alex Dupont" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Adresse E-mail</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" placeholder="ex: alex@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Mot de passe</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="********" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Rôle</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Sélectionnez un rôle" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="user">Utilisateur</SelectItem>
                                                                <SelectItem value="vendor">Vendeur</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="initialBalance"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Solde de Tokens Initial</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" placeholder="0" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit">Créer l'utilisateur</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>

                        <Button asChild size="sm" className="gap-1">
                            <Link href="/kyc">
                                Gérer les Vérifications
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
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

    