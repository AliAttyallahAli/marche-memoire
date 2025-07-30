
import { Download } from "lucide-react"

import { salaries } from "@/lib/data"
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SalairesPage() {
  const totalSalaries = salaries.reduce((sum, salary) => sum + salary.amount, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des Salaires</CardTitle>
            <CardDescription>
              Consultez l'historique des paiements de salaires.
            </CardDescription>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter les données
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Date de paiement</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salaries.map((salary) => (
              <TableRow key={salary.id}>
                <TableCell className="font-medium">{salary.employeeName}</TableCell>
                <TableCell>{new Date(salary.payDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(salary.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="text-right font-bold">Total</TableCell>
              <TableCell className="text-right font-bold">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalSalaries)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
