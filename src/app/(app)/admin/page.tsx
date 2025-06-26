import {
  Users,
  CircleDollarSign,
  ShoppingBag,
  MoreVertical,
} from "lucide-react"

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
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    An overview of the entire platform.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allUsers.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Number of registered users
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tokens Issued</CardTitle>
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTokens.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', 'T ')}</div>
                        <p className="text-xs text-muted-foreground">
                            Total tokens across all users
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Marketplace Volume</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{marketplaceVolume.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', 'T ')}</div>
                         <p className="text-xs text-muted-foreground">
                            Total value of products sold
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all users on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>KYC Status</TableHead>
                                <TableHead className="text-right">Token Balance</TableHead>
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
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={kycStatusVariant[user.kycStatus]}>{user.kycStatus}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {user.tokenBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', 'T ')}
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
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Suspend</DropdownMenuItem>
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
