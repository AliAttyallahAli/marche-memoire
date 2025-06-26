import { allTransactions } from "@/lib/data"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function TransactionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A complete record of all your account activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="purchase">Purchases</TabsTrigger>
              <TabsTrigger value="bonus">Bonuses</TabsTrigger>
              <TabsTrigger value="deposit">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            </TabsList>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
          </div>
          <TabsContent value="all">
            <TransactionTable transactions={allTransactions} />
          </TabsContent>
          <TabsContent value="purchase">
            <TransactionTable transactions={allTransactions.filter(t => t.type === 'Purchase')} />
          </TabsContent>
          <TabsContent value="bonus">
            <TransactionTable transactions={allTransactions.filter(t => t.type === 'Referral Bonus')} />
          </TabsContent>
          <TabsContent value="deposit">
             <TransactionTable transactions={allTransactions.filter(t => t.type === 'Deposit')} />
          </TabsContent>
           <TabsContent value="withdrawal">
             <TransactionTable transactions={allTransactions.filter(t => t.type === 'Withdrawal')} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function TransactionTable({ transactions }: { transactions: typeof allTransactions }) {
  return (
     <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
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
     </div>
  )
}
