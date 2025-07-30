
import { PlusCircle } from "lucide-react"

import { jobRoles } from "@/lib/data"
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

export default function FonctionsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fonctions & Services</CardTitle>
            <CardDescription>
              Gérez les rôles et les descriptions de poste au sein de l'entreprise.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une fonction
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre du poste</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{role.department}</Badge>
                </TableCell>
                <TableCell>{role.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
