
export type Employee = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  salary: number;
};

export const employee: Employee = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    avatar: 'https://placehold.co/100x100.png',
    role: 'Développeur Frontend',
    department: 'Technologie',
    salary: 60000,
};


export type Department = {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'Vacances' | 'Maladie' | 'Personnel';
  status: 'En attente' | 'Approuvé' | 'Rejeté';
};

export type Salary = {
    id: string;
    employeeId: string;
    amount: number;
    payDate: string;
};
