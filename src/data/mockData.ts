import { Student, Parent, Coach, Service, Package, Contract, Invoice, Payment, Session, Expense, DashboardStats } from '../types';

export const generateMockData = () => {
  // Parents
  const parents: Parent[] = [
    {
      id: '1',
      name: 'Ayşe Yılmaz',
      phone: '+90 532 123 4567',
      email: 'ayse.yilmaz@email.com',
      preferredChannel: 'whatsapp',
      kvkkConsent: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Mehmet Demir',
      phone: '+90 533 987 6543',
      email: 'mehmet.demir@email.com',
      preferredChannel: 'email',
      kvkkConsent: true,
      createdAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      name: 'Fatma Öztürk',
      phone: '+90 534 555 1234',
      email: 'fatma.ozturk@email.com',
      preferredChannel: 'phone',
      kvkkConsent: true,
      createdAt: '2024-02-01T09:00:00Z'
    },
    {
      id: '4',
      name: 'Ali Kaya',
      phone: '+90 535 777 8899',
      email: 'ali.kaya@email.com',
      preferredChannel: 'whatsapp',
      kvkkConsent: true,
      createdAt: '2024-02-10T16:45:00Z'
    }
  ];

  // Students
  const students: Student[] = [
    {
      id: '1',
      firstName: 'Elif',
      lastName: 'Yılmaz',
      grade: '11. Sınıf',
      school: 'Atatürk Anadolu Lisesi',
      parentId: '1',
      status: 'active',
      tags: ['matematik', 'fizik'],
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      firstName: 'Can',
      lastName: 'Demir',
      grade: '12. Sınıf',
      school: 'Fen Lisesi',
      parentId: '2',
      status: 'active',
      tags: ['kimya', 'biyoloji'],
      createdAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      firstName: 'Zeynep',
      lastName: 'Öztürk',
      grade: '10. Sınıf',
      school: 'Özel Koleji',
      parentId: '3',
      status: 'active',
      tags: ['türkçe', 'tarih'],
      createdAt: '2024-02-01T09:00:00Z'
    },
    {
      id: '4',
      firstName: 'Barış',
      lastName: 'Kaya',
      grade: '9. Sınıf',
      school: 'Anadolu Lisesi',
      parentId: '4',
      status: 'active',
      tags: ['matematik', 'geometri'],
      createdAt: '2024-02-10T16:45:00Z'
    }
  ];

  // Coaches
  const coaches: Coach[] = [
    {
      id: '1',
      name: 'Dr. Ahmet Şen',
      branch: ['Matematik', 'Fizik'],
      hourlyRate: 200,
      email: 'ahmet.sen@academico.com',
      phone: '+90 532 111 2233',
      availability: 'Pazartesi-Cuma 09:00-18:00',
      assignedStudents: ['1', '4'],
      sharePercentage: 60, // Koç %60 alıyor
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Prof. Elif Arslan',
      branch: ['Kimya', 'Biyoloji'],
      hourlyRate: 250,
      email: 'elif.arslan@academico.com',
      phone: '+90 533 222 3344',
      availability: 'Pazartesi-Cumartesi 10:00-19:00',
      assignedStudents: ['2'],
      sharePercentage: 65, // Koç %65 alıyor
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Öğr. Gör. Serkan Yılmaz',
      branch: ['Türkçe', 'Tarih', 'Coğrafya'],
      hourlyRate: 180,
      email: 'serkan.yilmaz@academico.com',
      phone: '+90 534 333 4455',
      availability: 'Salı-Pazar 14:00-20:00',
      assignedStudents: ['3'],
      sharePercentage: 55, // Koç %55 alıyor
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  // Services
  const services: Service[] = [
    {
      id: '1',
      name: 'Birebir Özel Ders',
      type: 'private_lesson',
      unit: 'hour',
      unitPrice: 200,
      vatRate: 18,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Grup Dersi (2-3 kişi)',
      type: 'private_lesson',
      unit: 'hour',
      unitPrice: 120,
      vatRate: 18,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      name: 'Online Koçluk',
      type: 'coaching',
      unit: 'session',
      unitPrice: 150,
      vatRate: 18,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      name: 'Aylık Takip Programı',
      type: 'coaching',
      unit: 'month',
      unitPrice: 800,
      vatRate: 18,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  // Packages
  const packages: Package[] = [
    {
      id: '1',
      serviceId: '1',
      name: 'Aylık 8 Ders Paketi',
      durationMonths: 1,
      includedUnits: 8,
      listPrice: 1600,
      discountPercent: 0,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      serviceId: '1',
      name: 'Dönem Paketi (20 Ders)',
      durationMonths: 3,
      includedUnits: 20,
      listPrice: 4000,
      discountPercent: 10,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      serviceId: '3',
      name: 'Haftalık Koçluk',
      durationMonths: 1,
      includedUnits: 4,
      listPrice: 600,
      discountPercent: 0,
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      serviceId: '4',
      name: 'Yıllık Takip Programı',
      durationMonths: 12,
      includedUnits: 12,
      listPrice: 9000,
      discountPercent: 15,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  // Contracts
  const contracts: Contract[] = [
    {
      id: '1',
      studentId: '1',
      packageId: '1',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      paymentCycle: 'monthly',
      dueDay: 15,
      paymentMethod: 'transfer',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      studentId: '2',
      packageId: '2',
      startDate: '2024-01-20',
      endDate: '2024-04-20',
      paymentCycle: 'installment',
      dueDay: 20,
      paymentMethod: 'card',
      status: 'active',
      createdAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      studentId: '3',
      packageId: '3',
      startDate: '2024-02-01',
      endDate: '2024-12-01',
      paymentCycle: 'monthly',
      dueDay: 1,
      paymentMethod: 'cash',
      status: 'active',
      createdAt: '2024-02-01T09:00:00Z'
    }
  ];

  // Invoices
  const invoices: Invoice[] = [
    {
      id: '1',
      contractId: '1',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      amountNet: 1600,
      vatRate: 18,
      amountGross: 1888,
      status: 'paid',
      balance: 0,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      contractId: '1',
      issueDate: '2024-02-15',
      dueDate: '2024-03-15',
      amountNet: 1600,
      vatRate: 18,
      amountGross: 1888,
      status: 'paid',
      balance: 0,
      createdAt: '2024-02-15T10:30:00Z'
    },
    {
      id: '3',
      contractId: '1',
      issueDate: '2024-03-15',
      dueDate: '2024-04-15',
      amountNet: 1600,
      vatRate: 18,
      amountGross: 1888,
      status: 'overdue',
      balance: 1888,
      createdAt: '2024-03-15T10:30:00Z'
    },
    {
      id: '4',
      contractId: '2',
      issueDate: '2024-01-20',
      dueDate: '2024-02-20',
      amountNet: 1200,
      vatRate: 18,
      amountGross: 1416,
      status: 'pending',
      balance: 1416,
      createdAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '5',
      contractId: '3',
      issueDate: '2024-02-01',
      dueDate: '2024-03-01',
      amountNet: 600,
      vatRate: 18,
      amountGross: 708,
      status: 'paid',
      balance: 0,
      createdAt: '2024-02-01T09:00:00Z'
    }
  ];

  // Payments
  const payments: Payment[] = [
    {
      id: '1',
      invoiceId: '1',
      paidAt: '2024-02-10T14:30:00Z',
      amount: 1888,
      method: 'transfer',
      reference: 'TRF001',
      coachShare: 1132.8, // %60 koç payı
      managementShare: 755.2, // %40 yönetim payı
      coachSharePercentage: 60,
      createdAt: '2024-02-10T14:30:00Z'
    },
    {
      id: '2',
      invoiceId: '2',
      paidAt: '2024-03-12T09:15:00Z',
      amount: 1888,
      method: 'transfer',
      reference: 'TRF002',
      coachShare: 1132.8, // %60 koç payı
      managementShare: 755.2, // %40 yönetim payı
      coachSharePercentage: 60,
      createdAt: '2024-03-12T09:15:00Z'
    },
    {
      id: '3',
      invoiceId: '5',
      paidAt: '2024-02-28T16:45:00Z',
      amount: 708,
      method: 'cash',
      reference: 'CSH001',
      coachShare: 389.4, // %55 koç payı
      managementShare: 318.6, // %45 yönetim payı
      coachSharePercentage: 55,
      createdAt: '2024-02-28T16:45:00Z'
    }
  ];

  // Sessions
  const sessions: Session[] = [
    {
      id: '1',
      studentId: '1',
      coachId: '1',
      serviceId: '1',
      startAt: '2024-03-20T14:00:00Z',
      durationMinutes: 60,
      status: 'completed',
      notes: 'Matematik - Trigonometri konusu işlendi',
      createdAt: '2024-03-20T14:00:00Z'
    },
    {
      id: '2',
      studentId: '2',
      coachId: '2',
      serviceId: '1',
      startAt: '2024-03-21T15:00:00Z',
      durationMinutes: 60,
      status: 'completed',
      notes: 'Kimya - Organik bileşikler',
      createdAt: '2024-03-21T15:00:00Z'
    },
    {
      id: '3',
      studentId: '3',
      coachId: '3',
      serviceId: '3',
      startAt: '2024-03-22T16:00:00Z',
      durationMinutes: 45,
      status: 'completed',
      notes: 'Online koçluk - Çalışma planı',
      createdAt: '2024-03-22T16:00:00Z'
    }
  ];

  // Expenses
  const expenses: Expense[] = [
    {
      id: '1',
      category: 'salary',
      vendor: 'Dr. Ahmet Şen',
      amount: 15000,
      vatRate: 0,
      date: '2024-03-01',
      notes: 'Mart ayı maaş ödemesi',
      createdAt: '2024-03-01T00:00:00Z'
    },
    {
      id: '2',
      category: 'rent',
      vendor: 'Emlak A.Ş.',
      amount: 8000,
      vatRate: 18,
      date: '2024-03-01',
      notes: 'Dersane kira ödemesi - Mart',
      createdAt: '2024-03-01T00:00:00Z'
    },
    {
      id: '3',
      category: 'marketing',
      vendor: 'Dijital Reklam Ltd.',
      amount: 2500,
      vatRate: 18,
      date: '2024-03-05',
      notes: 'Google Ads kampanyası',
      createdAt: '2024-03-05T00:00:00Z'
    },
    {
      id: '4',
      category: 'equipment',
      vendor: 'Ofis Ekipmanları',
      amount: 1200,
      vatRate: 18,
      date: '2024-03-10',
      notes: 'Yazı tahtası ve projeksiyon',
      createdAt: '2024-03-10T00:00:00Z'
    }
  ];

  // Dashboard Stats
  const dashboardStats: DashboardStats = {
    monthlyRevenue: 12580,
    monthlyExpenses: 26700,
    monthlyProfit: -14120,
    collectionRate: 75.5,
    upcomingDues: { count: 3, amount: 4012 },
    overdueAmount: { count: 1, amount: 1888 },
    totalStudents: 4,
    activeContracts: 3
  };

  return {
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
    dashboardStats
  };
};