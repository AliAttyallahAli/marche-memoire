
import {
  Building,
  CalendarOff,
  Users,
  WalletCards,
} from "lucide-react"
import Link from "next/link"

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
import { employees as allEmployees, leaveRequests } from "@/lib/data"

export default function Dashboard() {
  const totalEmployees = allEmployees.length;
  const totalDepartments = 6; // This should be dynamic later
  const pendingLeaves = leaveRequests.filter(r => r.status === 'En attente').length;
  const latestSalaryCycle = "Juillet 2024";

  const newEmployees = allEmployees.slice(0, 4);
  const recentLeaveRequests = leaveRequests.slice(0, 2);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Link href="/personnel">
            <Card className="hover:bg-muted/50 transition-colors">
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
          </Link>
          <Link href="/departements">
            <Card className="hover:bg-muted/50 transition-colors">
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
          </Link>
          <Link href="/conges">
            <Card className="hover:bg-muted/50 transition-colors">
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
          </Link>
          <Link href="/salaires">
             <Card className="hover:bg-muted/50 transition-colors">
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
          </Link>
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
                    {newEmployees.map((employee) => (
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
                                    <TableCell className="font-medium">{request.employeeName}</TableCell>
                                    <TableCell>{request.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={request.status === 'Approuvé' ? 'default' : (request.status === 'En attente' ? 'secondary' : 'destructive')}>{request.status}</Badge>
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
