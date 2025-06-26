import { user, allTransactions } from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export default function WalletPage() {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>My Wallet</CardTitle>
          <CardDescription>
            Your personal token wallet for all transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-center justify-between p-6 bg-secondary/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-4xl font-bold">
                {user.tokenBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('$', 'T ')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Send
              </Button>
              <Button variant="outline">
                <ArrowDownLeft className="mr-2 h-4 w-4" />
                Receive
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Wallet Details</h3>
            <div className="flex items-center justify-between rounded-md border p-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Unique Wallet Key</p>
                <p className="font-mono text-sm break-all">{user.walletKey}</p>
              </div>
              <Button variant="ghost" size="icon">
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wallet History</CardTitle>
          <CardDescription>
            A complete record of your wallet's transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'Purchase' || transaction.type === 'Withdrawal' ? 'destructive' : 'secondary'} className="capitalize">
                      {transaction.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={transaction.status === 'Completed' ? 'default' : (transaction.status === 'Pending' ? 'outline' : 'destructive')}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
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
    </div>
  )
}
