import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Parent, Coach, Service, Package, Contract, Invoice, Payment, Session, Expense, User, DashboardStats, PaymentSchedule } from '../types';
import { 
  apiService,
  studentApiService, 
  parentApiService, 
  coachApiService, 
  paymentScheduleApiService,
  paymentApiService
} from '../services/apiService';

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
  paymentSchedules: PaymentSchedule[];
  dashboardStats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  addStudent: (student: Omit<Student, 'id' | 'createdAt'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  addParent: (parent: Omit<Parent, 'id' | 'createdAt'>) => Promise<string>;
  updateParent: (id: string, parent: Partial<Parent>) => Promise<void>;
  deleteParent: (id: string) => Promise<void>;
  addCoach: (coach: Omit<Coach, 'id' | 'createdAt'>) => Promise<void>;
  updateCoach: (id: string, coach: Partial<Coach>) => Promise<void>;
  deleteCoach: (id: string) => Promise<void>;
  addPaymentSchedule: (schedule: Omit<PaymentSchedule, 'id' | 'createdAt'>) => Promise<void>;
  updatePaymentSchedule: (id: string, schedule: Partial<PaymentSchedule>) => Promise<void>;
  deletePaymentSchedule: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    email: 'admin@academico.com',
    role: 'admin',
    createdAt: new Date().toISOString()
  });
  
  // State variables
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [paymentSchedules, setPaymentSchedules] = useState<PaymentSchedule[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    monthlyProfit: 0,
    collectionRate: 0,
    upcomingDues: { count: 0, amount: 0 },
    overdueAmount: { count: 0, amount: 0 },
    totalStudents: 0,
    activeContracts: 0
  });
  
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Veri yükleme fonksiyonu
  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Server durumunu kontrol et
      const serverOnline = await apiService.checkServerStatus();
      if (!serverOnline) {
        throw new Error('JSON Server çalışmıyor. Lütfen "json-server --watch db.json --port 3001" komutunu çalıştırın.');
      }

      const [
        studentsData,
        parentsData,
        coachesData,
        paymentSchedulesData,
        paymentsData
      ] = await Promise.all([
        studentApiService.getAll(),
        parentApiService.getAll(),
        coachApiService.getAll(),
        paymentScheduleApiService.getAll(),
        paymentApiService.getAll()
      ]);

      setStudents(studentsData);
      setParents(parentsData);
      setCoaches(coachesData);
      setPaymentSchedules(paymentSchedulesData);
      setPayments(paymentsData);

      // İstatistikleri güncelle
      setDashboardStats({
        monthlyRevenue: paymentsData.reduce((sum, p) => sum + p.amount, 0),
        monthlyExpenses: 0,
        monthlyProfit: paymentsData.reduce((sum, p) => sum + p.amount, 0),
        collectionRate: 85,
        upcomingDues: { count: paymentSchedulesData.filter(p => p.status === 'upcoming').length, amount: 0 },
        overdueAmount: { count: paymentSchedulesData.filter(p => p.status === 'overdue').length, amount: 0 },
        totalStudents: studentsData.length,
        activeContracts: 0
      });

    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    refreshData();
  }, []);

  // CRUD Fonksiyonları
  const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
    try {
      console.log('🎓 Öğrenci ekleniyor:', student);
      const newStudent = await studentApiService.create(student);
      console.log('✅ Öğrenci eklendi:', newStudent);
      await refreshData();
    } catch (error) {
      console.error('❌ Öğrenci ekleme hatası:', error);
      setError(`Öğrenci eklenirken hata oluştu: ${error}`);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      await studentApiService.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Öğrenci güncelleme hatası:', error);
      setError('Öğrenci güncellenirken hata oluştu');
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await studentApiService.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Öğrenci silme hatası:', error);
      setError('Öğrenci silinirken hata oluştu');
    }
  };

  const addParent = async (parent: Omit<Parent, 'id' | 'createdAt'>) => {
    try {
      console.log('👨‍👩‍👧‍👦 Veli ekleniyor:', parent);
      const newParent = await parentApiService.create(parent);
      console.log('✅ Veli eklendi:', newParent);
      await refreshData();
      return newParent.id;
    } catch (error) {
      console.error('❌ Veli ekleme hatası:', error);
      setError(`Veli eklenirken hata oluştu: ${error}`);
      return '';
    }
  };

  const updateParent = async (id: string, updates: Partial<Parent>) => {
    try {
      await parentApiService.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Veli güncelleme hatası:', error);
      setError('Veli güncellenirken hata oluştu');
    }
  };

  const deleteParent = async (id: string) => {
    try {
      await parentApiService.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Veli silme hatası:', error);
      setError('Veli silinirken hata oluştu');
    }
  };

  const addCoach = async (coach: Omit<Coach, 'id' | 'createdAt'>) => {
    try {
      await coachApiService.create(coach);
      await refreshData();
    } catch (error) {
      console.error('Koç ekleme hatası:', error);
      setError('Koç eklenirken hata oluştu');
    }
  };

  const updateCoach = async (id: string, updates: Partial<Coach>) => {
    try {
      await coachApiService.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Koç güncelleme hatası:', error);
      setError('Koç güncellenirken hata oluştu');
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      await coachApiService.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Koç silme hatası:', error);
      setError('Koç silinirken hata oluştu');
    }
  };

  const addPaymentSchedule = async (schedule: Omit<PaymentSchedule, 'id' | 'createdAt'>) => {
    try {
      await paymentScheduleApiService.create(schedule);
      await refreshData();
    } catch (error) {
      console.error('Ödeme planı ekleme hatası:', error);
      setError('Ödeme planı eklenirken hata oluştu');
    }
  };

  const updatePaymentSchedule = async (id: string, updates: Partial<PaymentSchedule>) => {
    try {
      await paymentScheduleApiService.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Ödeme planı güncelleme hatası:', error);
      setError('Ödeme planı güncellenirken hata oluştu');
    }
  };

  const deletePaymentSchedule = async (id: string) => {
    try {
      await paymentScheduleApiService.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Ödeme planı silme hatası:', error);
      setError('Ödeme planı silinirken hata oluştu');
    }
  };

  const addService = (service: Omit<Service, 'id' | 'createdAt'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setServices(prev => [...prev, newService]);
  };

  const addPackage = (pkg: Omit<Package, 'id' | 'createdAt'>) => {
    const newPackage: Package = {
      ...pkg,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPackages(prev => [...prev, newPackage]);
  };

  const addContract = (contract: Omit<Contract, 'id' | 'createdAt'>) => {
    const newContract: Contract = {
      ...contract,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setContracts(prev => [...prev, newContract]);
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [...prev, newInvoice]);
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt'>) => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
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
    paymentSchedules,
    dashboardStats,
    isLoading,
    error,
    activeView,
    setActiveView,
    sidebarOpen,
    setSidebarOpen,
    addStudent,
    updateStudent,
    deleteStudent,
    addParent,
    updateParent,
    deleteParent,
    addCoach,
    updateCoach,
    deleteCoach,
    addPaymentSchedule,
    updatePaymentSchedule,
    deletePaymentSchedule,
    refreshData,
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