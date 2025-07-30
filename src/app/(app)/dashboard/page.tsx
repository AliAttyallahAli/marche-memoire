import {
  Building,
  CalendarOff,
  Users,
  WalletCards,
} from "lucide-react"
import Link from "next/link"

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data - replace with actual data from your API
const employees = [
  { id: 1, name: "Alice Durand", role: "Développeuse", department: "Technologie", avatar: "https://placehold.co/100x100.png" },
  { id: 2, name: "Bob Martin", role: "Designer UX", department: "Design", avatar: "https://placehold.co/100x100.png" },
  { id: 3, name: "Charlie Dubois", role: "Chef de Projet", department: "Produit", avatar: "https://placehold.co/100x100.png" },
  { id: 4, name: "Diana Lefebvre", role: "Marketing", department: "Ventes", avatar: "https://placehold.co/100x100.png" },
];

const recentLeaveRequests = [
    { id: 1, employee: "Bob Martin", type: "Vacances", status: "Approuvé" },
    { id: 2, employee: "Alice Durand", type: "Maladie", status: "En attente" },
];

export default function Dashboard() {
  const totalEmployees = 58;
  const totalDepartments = 6;
  const pendingLeaves = 3;
  const latestSalaryCycle = "Juillet 2024";

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total des Employés
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                +3 depuis le mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Départements
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDepartments}</div>
               <p className="text-xs text-muted-foreground">
                Total des départements actifs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Congés en Attente</CardTitle>
              <CalendarOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLeaves}</div>
              <p className="text-xs text-muted-foreground">
                Demandes à approuver
              </p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernier Cycle de Paie</CardTitle>
               <WalletCards className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{latestSalaryCycle}</div>
                <p className="text-xs text-muted-foreground">
                    Statut : Terminé
                </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Nouveaux Employés</CardTitle>
                <CardDescription>Les derniers membres à avoir rejoint l'équipe.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Département</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                           <div className="flex items-center gap-4">
                              <Avatar className="h-9 w-9">
                                  <AvatarImage src={employee.avatar} alt={employee.name} data-ai-hint="user avatar" />
                                  <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{employee.name}</div>
                           </div>
                        </TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Demandes de Congés Récentes</CardTitle>
                    <CardDescription>Aperçu des dernières demandes de congés.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employé</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentLeaveRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="font-medium">{request.employee}</TableCell>
                                    <TableCell>{request.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={request.status === 'Approuvé' ? 'default' : 'secondary'}>{request.status}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
