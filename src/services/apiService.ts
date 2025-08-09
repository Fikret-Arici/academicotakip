// JSON Server API Service - Gerçek Çoklu Kullanıcı Desteği
import { 
  Student, 
  Parent, 
  Coach, 
  PaymentSchedule, 
  Payment
} from '../types';

const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Generic HTTP methods
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`🔄 API Request: ${options.method || 'GET'} ${url}`, config.body ? JSON.parse(config.body as string) : '');

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Request failed: ${endpoint}`, error);
      throw new Error(`API isteği başarısız: ${error}`);
    }
  }

  private async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  private async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  private async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  private async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Generic CRUD operations
  async getAll<T>(collection: string): Promise<T[]> {
    return this.get<T[]>(`/${collection}`);
  }

  async getById<T>(collection: string, id: string): Promise<T> {
    return this.get<T>(`/${collection}/${id}`);
  }

  async create<T>(collection: string, item: Omit<T, 'id' | 'createdAt'>): Promise<T> {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    return this.post<T>(`/${collection}`, newItem);
  }

  async update<T>(collection: string, id: string, updates: Partial<T>): Promise<T> {
    const updatedItem = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.put<T>(`/${collection}/${id}`, updatedItem);
  }

  async remove(collection: string, id: string): Promise<void> {
    await this.delete(`/${collection}/${id}`);
  }

  // Server durumu kontrol et
  async checkServerStatus(): Promise<boolean> {
    try {
      await this.get('/students');
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Singleton instance
export const apiService = ApiService.getInstance();

// Collection-specific services
export const studentApiService = {
  getAll: () => apiService.getAll<Student>('students'),
  getById: (id: string) => apiService.getById<Student>('students', id),
  create: (student: Omit<Student, 'id' | 'createdAt'>) => apiService.create<Student>('students', student),
  update: (id: string, updates: Partial<Student>) => apiService.update<Student>('students', id, updates),
  delete: (id: string) => apiService.remove('students', id)
};

export const parentApiService = {
  getAll: () => apiService.getAll<Parent>('parents'),
  getById: (id: string) => apiService.getById<Parent>('parents', id),
  create: (parent: Omit<Parent, 'id' | 'createdAt'>) => apiService.create<Parent>('parents', parent),
  update: (id: string, updates: Partial<Parent>) => apiService.update<Parent>('parents', id, updates),
  delete: (id: string) => apiService.remove('parents', id)
};

export const coachApiService = {
  getAll: () => apiService.getAll<Coach>('coaches'),
  getById: (id: string) => apiService.getById<Coach>('coaches', id),
  create: (coach: Omit<Coach, 'id' | 'createdAt'>) => apiService.create<Coach>('coaches', coach),
  update: (id: string, updates: Partial<Coach>) => apiService.update<Coach>('coaches', id, updates),
  delete: (id: string) => apiService.remove('coaches', id)
};

export const paymentScheduleApiService = {
  getAll: () => apiService.getAll<PaymentSchedule>('paymentSchedules'),
  getById: (id: string) => apiService.getById<PaymentSchedule>('paymentSchedules', id),
  create: (schedule: Omit<PaymentSchedule, 'id' | 'createdAt'>) => apiService.create<PaymentSchedule>('paymentSchedules', schedule),
  update: (id: string, updates: Partial<PaymentSchedule>) => apiService.update<PaymentSchedule>('paymentSchedules', id, updates),
  delete: (id: string) => apiService.remove('paymentSchedules', id)
};

export const paymentApiService = {
  getAll: () => apiService.getAll<Payment>('payments'),
  create: (payment: Omit<Payment, 'id' | 'createdAt'>) => apiService.create<Payment>('payments', payment)
};

export default apiService;
