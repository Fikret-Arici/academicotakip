import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Student, Parent, Coach, Service, Package, Contract, Invoice, Payment, Session, Expense, User, DashboardStats, UserRole } from '../types';
import { generateMockData } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  students: Student[];
  parents: Parent[];
  coaches: Coach[];
  services: Service[];
  packages: Package[];
  contracts: Contract[];
  invoices: Invoice[];
  payments: Payment[];
  sessions: Session[];
  expenses: Expense[];
  dashboardStats: DashboardStats;
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => void;
  addParent: (parent: Omit<Parent, 'id' | 'createdAt'>) => void;
  addCoach: (coach: Omit<Coach, 'id' | 'createdAt'>) => void;
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => void;
  addPackage: (pkg: Omit<Package, 'id' | 'createdAt'>) => void;
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: Invoice['status'], balance?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const mockData = generateMockData();
  
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    email: 'admin@academico.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  });
  
  const [students, setStudents] = useState<Student[]>(mockData.students);
  const [parents, setParents] = useState<Parent[]>(mockData.parents);
  const [coaches, setCoaches] = useState<Coach[]>(mockData.coaches);
  const [services, setServices] = useState<Service[]>(mockData.services);
  const [packages, setPackages] = useState<Package[]>(mockData.packages);
  const [contracts, setContracts] = useState<Contract[]>(mockData.contracts);
  const [invoices, setInvoices] = useState<Invoice[]>(mockData.invoices);
  const [payments, setPayments] = useState<Payment[]>(mockData.payments);
  const [sessions, setSessions] = useState<Session[]>(mockData.sessions);
  const [expenses, setExpenses] = useState<Expense[]>(mockData.expenses);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockData.dashboardStats);
  
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addStudent = (student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent: Student = {
      ...student,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const addParent = (parent: Omit<Parent, 'id' | 'createdAt'>) => {
    const newParent: Parent = {
      ...parent,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setParents(prev => [...prev, newParent]);
  };

  const addCoach = (coach: Omit<Coach, 'id' | 'createdAt'>) => {
    const newCoach: Coach = {
      ...coach,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setCoaches(prev => [...prev, newCoach]);
  };

  const addService = (service: Omit<Service, 'id' | 'createdAt'>) => {
    const newService: Service = {
      ...service,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setServices(prev => [...prev, newService]);
  };

  const addPackage = (pkg: Omit<Package, 'id' | 'createdAt'>) => {
    const newPackage: Package = {
      ...pkg,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setPackages(prev => [...prev, newPackage]);
  };

  const addContract = (contract: Omit<Contract, 'id' | 'createdAt'>) => {
    const newContract: Contract = {
      ...contract,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setContracts(prev => [...prev, newContract]);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, newInvoice]);
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status'], balance?: number) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { ...invoice, status, balance: balance ?? invoice.balance }
        : invoice
    ));
  };

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    students,
    parents,
    coaches,
    services,
    packages,
    contracts,
    invoices,
    payments,
    sessions,
    expenses,
    dashboardStats,
    activeView,
    setActiveView,
    sidebarOpen,
    setSidebarOpen,
    addStudent,
    addParent,
    addCoach,
    addService,
    addPackage,
    addContract,
    addInvoice,
    addPayment,
    addExpense,
    updateInvoiceStatus
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};