import {
  Users,
  CircleDollarSign,
  ShoppingBag,
  MoreVertical,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"

import { user, allTransactions, products } from "@/lib/data"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Dashboard() {
  const recentTransactions = allTransactions.slice(0, 5)
  const topProducts = products.slice(0,3)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Token Balance
              </CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.tokenBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', 'T ')}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.kycStatus}</div>
              <p className="text-xs text-muted-foreground">
                Your identity verification status.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                    A quick look at your latest account activity.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="/transactions">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.date}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-destructive'}`}>
                           {transaction.amount > 0 ? '+' : ''}
                           {transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', 'T ')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <div className="grid gap-2">
                        <CardTitle>Top Products</CardTitle>
                        <CardDescription>
                        Most popular items on the marketplace.
                        </CardDescription>
                    </div>
                     <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/marketplace">
                        Shop All
                        <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                     <div className="grid gap-8">
                        {topProducts.map((product) => (
                            <div key={product.id} className="flex items-center gap-4">
                               <div className="relative aspect-square h-12 w-12">
                                     <Image src={product.image} alt={product.name} fill className="rounded-md object-cover" data-ai-hint={product.aiHint} />
                               </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium leading-none">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">{product.description.substring(0, 30)}...</p>
                                </div>
                                <div className="ml-auto font-medium">T {product.price.toFixed(2)}</div>
                            </div>
                        ))}
                     </div>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
