// JSON Dosya Tabanlı Veri Servisi
import { 
  Student, 
  Parent, 
  Coach, 
  PaymentSchedule, 
  Payment, 
  Invoice,
  Contract,
  Session,
  Expense,
  Service,
  Package
} from '../types';

// Veritabanı yapısı
export interface Database {
  students: Student[];
  parents: Parent[];
  coaches: Coach[];
  paymentSchedules: PaymentSchedule[];
  payments: Payment[];
  invoices: Invoice[];
  contracts: Contract[];
  sessions: Session[];
  expenses: Expense[];
  services: Service[];
  packages: Package[];
  settings: {
    lastBackup: string;
    version: string;
  };
}

class FileService {
  private static instance: FileService;
  private database: Database | null = null;
  private readonly dbPath = '/src/data/database.json';

  private constructor() {}

  public static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService();
    }
    return FileService.instance;
  }

  // Veritabanını yükle
  async loadDatabase(): Promise<Database> {
    try {
      if (this.database) {
        return this.database;
      }

      // JSON dosyasını fetch ile oku
      const response = await fetch('/src/data/database.json');
      if (!response.ok) {
        throw new Error('Veritabanı dosyası okunamadı');
      }
      
      const data = await response.json();
      this.database = data;
      return data;
    } catch (error) {
      console.error('Database load error:', error);
      
      // Hata durumunda boş veritabanı döndür
      const emptyDb: Database = {
        students: [],
        parents: [],
        coaches: [],
        paymentSchedules: [],
        payments: [],
        invoices: [],
        contracts: [],
        sessions: [],
        expenses: [],
        services: [],
        packages: [],
        settings: {
          lastBackup: new Date().toISOString(),
          version: '1.0.0'
        }
      };
      
      this.database = emptyDb;
      return emptyDb;
    }
  }

  // Veritabanını kaydet (LocalStorage kullanarak)
  async saveDatabase(database: Database): Promise<void> {
    try {
      // Yedek oluştur
      const backup = JSON.stringify(this.database);
      localStorage.setItem('academico_backup', backup);
      
      // Ana veriyi güncelle
      database.settings.lastBackup = new Date().toISOString();
      this.database = database;
      
      // LocalStorage'a kaydet
      localStorage.setItem('academico_database', JSON.stringify(database));
      
      console.log('✅ Veritabanı kaydedildi:', new Date().toLocaleString());
    } catch (error) {
      console.error('❌ Veritabanı kaydetme hatası:', error);
      throw new Error('Veritabanı kaydedilemedi');
    }
  }

  // LocalStorage'dan veri yükle
  async loadFromLocalStorage(): Promise<Database> {
    try {
      const stored = localStorage.getItem('academico_database');
      if (stored) {
        const data = JSON.parse(stored);
        this.database = data;
        return data;
      }
      
      // LocalStorage'da veri yoksa dosyadan yükle
      return await this.loadDatabase();
    } catch (error) {
      console.error('LocalStorage load error:', error);
      return await this.loadDatabase();
    }
  }

  // ID oluşturucu
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generic CRUD işlemleri
  async getAll<T>(collection: keyof Database): Promise<T[]> {
    const db = await this.loadFromLocalStorage();
    return (db[collection] as T[]) || [];
  }

  async getById<T>(collection: keyof Database, id: string): Promise<T | null> {
    const db = await this.loadFromLocalStorage();
    const items = (db[collection] as any[]) || [];
    return items.find(item => item.id === id) || null;
  }

  async add<T extends { id?: string }>(collection: keyof Database, item: Omit<T, 'id' | 'createdAt'>): Promise<string> {
    const db = await this.loadFromLocalStorage();
    const items = (db[collection] as T[]) || [];
    
    const id = this.generateId();
    const newItem = {
      ...item,
      id,
      createdAt: new Date().toISOString()
    } as T;
    
    items.push(newItem);
    (db[collection] as T[]) = items;
    
    await this.saveDatabase(db);
    return id;
  }

  async update<T extends { id: string }>(collection: keyof Database, id: string, updates: Partial<T>): Promise<void> {
    const db = await this.loadFromLocalStorage();
    const items = (db[collection] as T[]) || [];
    
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`${collection} içinde ID ${id} bulunamadı`);
    }
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    (db[collection] as T[]) = items;
    await this.saveDatabase(db);
  }

  async delete(collection: keyof Database, id: string): Promise<void> {
    const db = await this.loadFromLocalStorage();
    const items = (db[collection] as any[]) || [];
    
    const filteredItems = items.filter(item => item.id !== id);
    (db[collection] as any[]) = filteredItems;
    
    await this.saveDatabase(db);
  }

  // Özel sorgular
  async getWhere<T>(collection: keyof Database, field: string, value: any): Promise<T[]> {
    const db = await this.loadFromLocalStorage();
    const items = (db[collection] as any[]) || [];
    
    return items.filter(item => item[field] === value);
  }

  // Yedekleme
  async createBackup(): Promise<string> {
    const db = await this.loadFromLocalStorage();
    const backup = JSON.stringify(db, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Backup'ı LocalStorage'a kaydet
    localStorage.setItem(`academico_backup_${timestamp}`, backup);
    
    return `Yedek oluşturuldu: ${timestamp}`;
  }

  // Yedekten geri yükle
  async restoreFromBackup(): Promise<void> {
    const backup = localStorage.getItem('academico_backup');
    if (backup) {
      const data = JSON.parse(backup);
      await this.saveDatabase(data);
    } else {
      throw new Error('Yedek dosyası bulunamadı');
    }
  }

  // Veritabanını sıfırla
  async resetDatabase(): Promise<void> {
    const emptyDb: Database = {
      students: [],
      parents: [],
      coaches: [],
      paymentSchedules: [],
      payments: [],
      invoices: [],
      contracts: [],
      sessions: [],
      expenses: [],
      services: [],
      packages: [],
      settings: {
        lastBackup: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    
    await this.saveDatabase(emptyDb);
  }

  // İstatistikler
  async getStats(): Promise<any> {
    const db = await this.loadFromLocalStorage();
    
    return {
      totalStudents: db.students.length,
      activeStudents: db.students.filter(s => s.status === 'active').length,
      totalCoaches: db.coaches.length,
      activeCoaches: db.coaches.filter(c => c.status === 'active').length,
      totalPayments: db.payments.length,
      totalPaymentSchedules: db.paymentSchedules.length,
      upcomingPayments: db.paymentSchedules.filter(p => p.status === 'upcoming').length,
      overduePayments: db.paymentSchedules.filter(p => p.status === 'overdue').length,
      lastBackup: db.settings.lastBackup
    };
  }
}

// Singleton instance
export const fileService = FileService.getInstance();

// Kolay kullanım için wrapper fonksiyonlar
export const studentService = {
  getAll: () => fileService.getAll<Student>('students'),
  getById: (id: string) => fileService.getById<Student>('students', id),
  add: (student: Omit<Student, 'id' | 'createdAt'>) => fileService.add<Student>('students', student),
  update: (id: string, updates: Partial<Student>) => fileService.update<Student>('students', id, updates),
  delete: (id: string) => fileService.delete('students', id),
  getByParent: (parentId: string) => fileService.getWhere<Student>('students', 'parentId', parentId)
};

export const parentService = {
  getAll: () => fileService.getAll<Parent>('parents'),
  getById: (id: string) => fileService.getById<Parent>('parents', id),
  add: (parent: Omit<Parent, 'id' | 'createdAt'>) => fileService.add<Parent>('parents', parent),
  update: (id: string, updates: Partial<Parent>) => fileService.update<Parent>('parents', id, updates),
  delete: (id: string) => fileService.delete('parents', id)
};

export const coachService = {
  getAll: () => fileService.getAll<Coach>('coaches'),
  getById: (id: string) => fileService.getById<Coach>('coaches', id),
  add: (coach: Omit<Coach, 'id' | 'createdAt'>) => fileService.add<Coach>('coaches', coach),
  update: (id: string, updates: Partial<Coach>) => fileService.update<Coach>('coaches', id, updates),
  delete: (id: string) => fileService.delete('coaches', id)
};

export const paymentScheduleService = {
  getAll: () => fileService.getAll<PaymentSchedule>('paymentSchedules'),
  getById: (id: string) => fileService.getById<PaymentSchedule>('paymentSchedules', id),
  add: (schedule: Omit<PaymentSchedule, 'id' | 'createdAt'>) => fileService.add<PaymentSchedule>('paymentSchedules', schedule),
  update: (id: string, updates: Partial<PaymentSchedule>) => fileService.update<PaymentSchedule>('paymentSchedules', id, updates),
  delete: (id: string) => fileService.delete('paymentSchedules', id),
  getByStudent: (studentId: string) => fileService.getWhere<PaymentSchedule>('paymentSchedules', 'studentId', studentId)
};

export const paymentService = {
  getAll: () => fileService.getAll<Payment>('payments'),
  add: (payment: Omit<Payment, 'id' | 'createdAt'>) => fileService.add<Payment>('payments', payment)
};

export default fileService;
