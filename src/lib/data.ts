
export type Employee = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  salary: number;
};

export const employees: Employee[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex.j@example.com', avatar: 'https://placehold.co/100x100.png', role: 'Développeur Frontend', department: 'Technologie', salary: 60000 },
    { id: '2', name: 'Maria Garcia', email: 'maria.g@example.com', avatar: 'https://placehold.co/100x100.png', role: 'Designer UX', department: 'Design', salary: 55000 },
    { id: '3', name: 'James Smith', email: 'james.s@example.com', avatar: 'https://placehold.co/100x100.png', role: 'Chef de Projet', department: 'Produit', salary: 75000 },
    { id: '4', name: 'Patricia Brown', email: 'patricia.b@example.com', avatar: 'https://placehold.co/100x100.png', role: 'Spécialiste Marketing', department: 'Ventes', salary: 52000 },
     { id: '5', name: 'Robert Miller', email: 'robert.m@example.com', avatar: 'https://placehold.co/100x100.png', role: 'Ingénieur Backend', department: 'Technologie', salary: 68000 },
];

export const employee: Employee = employees[0];


export type Department = {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
};

export const departments: Department[] = [
    { id: 'tech', name: 'Technologie', manager: 'James Smith', employeeCount: 15 },
    { id: 'design', name: 'Design', manager: 'Maria Garcia', employeeCount: 5 },
    { id: 'product', name: 'Produit', manager: 'James Smith', employeeCount: 8 },
    { id: 'sales', name: 'Ventes', manager: 'Patricia Brown', employeeCount: 12 },
    { id: 'hr', name: 'Ressources Humaines', manager: 'Jessica Davis', employeeCount: 4 },
];


export type LeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'Vacances' | 'Maladie' | 'Personnel';
  status: 'En attente' | 'Approuvé' | 'Rejeté';
};

export const leaveRequests: LeaveRequest[] = [
    { id: 'leave1', employeeId: '2', employeeName: 'Maria Garcia', startDate: '2024-08-01', endDate: '2024-08-10', type: 'Vacances', status: 'Approuvé' },
    { id: 'leave2', employeeId: '1', employeeName: 'Alex Johnson', startDate: '2024-07-25', endDate: '2024-07-26', type: 'Maladie', status: 'En attente' },
    { id: 'leave3', employeeId: '4', employeeName: 'Patricia Brown', startDate: '2024-09-01', endDate: '2024-09-05', type: 'Vacances', status: 'Rejeté' },
    { id: 'leave4', employeeId: '3', employeeName: 'James Smith', startDate: '2024-08-15', endDate: '2024-08-15', type: 'Personnel', status: 'Approuvé' },
];

export type Salary = {
    id: string;
    employeeId: string;
    employeeName: string;
    amount: number;
    payDate: string;
};

export const salaries: Salary[] = [
    { id: 'salary1', employeeId: '1', employeeName: 'Alex Johnson', amount: 5000, payDate: '2024-06-30' },
    { id: 'salary2', employeeId: '2', employeeName: 'Maria Garcia', amount: 4583, payDate: '2024-06-30' },
    { id: 'salary3', employeeId: '3', employeeName: 'James Smith', amount: 6250, payDate: '2024-06-30' },
    { id: 'salary4', employeeId: '1', employeeName: 'Alex Johnson', amount: 5000, payDate: '2024-05-31' },
    { id: 'salary5', employeeId: '4', employeeName: 'Patricia Brown', amount: 4333, payDate: '2024-06-30' },
];

export type JobRole = {
    id: string;
    title: string;
    department: string;
    description: string;
}

export const jobRoles: JobRole[] = [
    { id: 'dev-front', title: 'Développeur Frontend', department: 'Technologie', description: 'Crée et maintient l\'interface utilisateur des applications web.' },
    { id: 'dev-back', title: 'Ingénieur Backend', department: 'Technologie', description: 'Gère la logique serveur, les bases de données et les APIs.' },
    { id: 'ux-designer', title: 'Designer UX/UI', department: 'Design', description: 'Conçoit des expériences utilisateur intuitives et esthétiques.' },
    { id: 'pm', title: 'Chef de Projet', department: 'Produit', description: 'Planifie, exécute et supervise les projets de développement.' },
    { id: 'mkt-spec', title: 'Spécialiste Marketing', department: 'Ventes', description: 'Développe et met en œuvre des stratégies marketing.' },
];
