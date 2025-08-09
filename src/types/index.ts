// Core types for the Academico Management System

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  school: string;
  parentId: string;
  status: 'active' | 'inactive';
  tags: string[];
  createdAt: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredChannel: 'phone' | 'whatsapp' | 'email';
  kvkkConsent: boolean;
  createdAt: string;
}

export interface Coach {
  id: string;
  name: string;
  branch: string[];
  hourlyRate: number;
  email: string;
  phone: string;
  availability: string;
  assignedStudents: string[];
  sharePercentage: number; // Koçun alacağı pay yüzdesi
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  type: 'private_lesson' | 'coaching' | 'other';
  unit: 'hour' | 'month' | 'session';
  unitPrice: number;
  vatRate: number;
  createdAt: string;
}

export interface Package {
  id: string;
  serviceId: string;
  name: string;
  durationMonths: number;
  includedUnits: number;
  listPrice: number;
  discountPercent: number;
  createdAt: string;
}

export interface Contract {
  id: string;
  studentId: string;
  packageId: string;
  startDate: string;
  endDate: string;
  paymentCycle: 'monthly' | 'installment';
  dueDay: number;
  paymentMethod: 'cash' | 'transfer' | 'card';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Invoice {
  id: string;
  contractId: string;
  issueDate: string;
  dueDate: string;
  amountNet: number;
  vatRate: number;
  amountGross: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  balance: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  paidAt: string;
  amount: number;
  method: 'cash' | 'transfer' | 'card';
  reference: string;
  coachShare?: number;
  managementShare?: number;
  coachSharePercentage?: number;
  createdAt: string;
}

export interface Session {
  id: string;
  studentId: string;
  coachId: string;
  serviceId: string;
  startAt: string;
  durationMinutes: number;
  status: 'completed' | 'cancelled' | 'postponed';
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  category: 'salary' | 'rent' | 'equipment' | 'software' | 'marketing';
  vendor: string;
  amount: number;
  vatRate: number;
  date: string;
  attachmentUrl?: string;
  notes: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'due_reminder' | 'overdue' | 'appointment';
  channel: 'email' | 'whatsapp' | 'sms';
  targetContact: string;
  content: string;
  scheduledAt: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'finance' | 'coach' | 'operations';
  coachId?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyProfit: number;
  collectionRate: number;
  upcomingDues: { count: number; amount: number };
  overdueAmount: { count: number; amount: number };
  totalStudents: number;
  activeContracts: number;
}

export type UserRole = 'admin' | 'finance' | 'coach' | 'operations';

export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  path: string;
  roles: UserRole[];
  children?: MenuItem[];
}