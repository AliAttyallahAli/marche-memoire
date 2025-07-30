
"use client"
import * as React from "react"
import { PlusCircle, Download, Check, X } from "lucide-react"

import { leaveRequests as initialLeaveRequests, LeaveRequest } from "@/lib/data"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function CongesPage() {
    const [open, setOpen] = React.useState(false)
    const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>(initialLeaveRequests);

    const statusVariant = {
        'Approuvé': 'default',
        'En attente': 'secondary',
        'Rejeté': 'destructive',
    } as const

    const handleStatusChange = (id: string, status: 'Approuvé' | 'Rejeté') => {
        setLeaveRequests(currentRequests =>
            currentRequests.map(req =>
                req.id === id ? { ...req, status: status } : req
            )
        );
    };

    const handleDownload = (request: LeaveRequest) => {
        const fileContent = `
Justificatif de congé
----------------------
Employé: ${request.employeeName}
Type de congé: ${request.type}
Période: du ${new Date(request.startDate).toLocaleDateString('fr-FR')} au ${new Date(request.endDate).toLocaleDateString('fr-FR')}
Statut: ${request.status}
Date de la décision: ${new Date().toLocaleDateString('fr-FR')}
`;
        const blob = new Blob([fileContent.trim()], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `justificatif_conge_${request.employeeName.replace(' ', '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestion des Congés</CardTitle>
            <CardDescription>
              Suivez et gérez les demandes de congés des employés.
            </CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Demander un congé
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nouvelle demande de congé</DialogTitle>
                    <DialogDescription>
                        Remplissez le formulaire pour soumettre votre demande.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start-date" className="text-right">Date de début</Label>
                        <Input id="start-date" type="date" className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="end-date" className="text-right">Date de fin</Label>
                        <Input id="end-date" type="date" className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="leave-type" className="text-right">Type</Label>
                        <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="vacances">Vacances</SelectItem>
                                <SelectItem value="maladie">Maladie</SelectItem>
                                <SelectItem value="personnel">Personnel</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => setOpen(false)}>Soumettre</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.employeeName}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                    {new Date(request.startDate).toLocaleDateString('fr-FR')} - {new Date(request.endDate).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                    {request.status === 'En attente' ? (
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="icon" onClick={() => handleStatusChange(request.id, 'Approuvé')}>
                                <Check className="h-4 w-4 text-green-500"/>
                            </Button>
                             <Button variant="outline" size="icon" onClick={() => handleStatusChange(request.id, 'Rejeté')}>
                                <X className="h-4 w-4 text-red-500"/>
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => handleDownload(request)}>
                            <Download className="mr-2 h-4 w-4" />
                            Télécharger
                        </Button>
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
