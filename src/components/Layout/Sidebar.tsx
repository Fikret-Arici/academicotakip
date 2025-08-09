import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Package, 
  FileText, 
  Receipt, 
  TrendingDown, 
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem, UserRole } from '../../types';

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    roles: ['admin', 'finance', 'coach', 'operations']
  },
  {
    id: 'students',
    title: 'Öğrenciler & Veliler',
    icon: 'Users',
    path: '/students',
    roles: ['admin', 'operations', 'coach']
  },
  {
    id: 'coaches',
    title: 'Koçlar',
    icon: 'GraduationCap',
    path: '/coaches',
    roles: ['admin', 'operations']
  },
  {
    id: 'services',
    title: 'Hizmetler & Paketler',
    icon: 'Package',
    path: '/services',
    roles: ['admin', 'operations']
  },
  {
    id: 'contracts',
    title: 'Sözleşmeler',
    icon: 'FileText',
    path: '/contracts',
    roles: ['admin', 'finance', 'operations']
  },
  {
    id: 'invoices',
    title: 'Faturalar & Tahsilat',
    icon: 'Receipt',
    path: '/invoices',
    roles: ['admin', 'finance']
  },
  {
    id: 'expenses',
    title: 'Giderler',
    icon: 'TrendingDown',
    path: '/expenses',
    roles: ['admin', 'finance']
  },
  {
    id: 'calendar',
    title: 'Takvim',
    icon: 'Calendar',
    path: '/calendar',
    roles: ['admin', 'operations', 'coach']
  },
  {
    id: 'reports',
    title: 'Raporlar',
    icon: 'BarChart3',
    path: '/reports',
    roles: ['admin', 'finance']
  },
  {
    id: 'settings',
    title: 'Ayarlar',
    icon: 'Settings',
    path: '/settings',
    roles: ['admin']
  }
];

const iconComponents: { [key: string]: React.ComponentType<any> } = {
  LayoutDashboard,
  Users,
  GraduationCap,
  Package,
  FileText,
  Receipt,
  TrendingDown,
  Calendar,
  BarChart3,
  Settings
};

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, sidebarOpen, setSidebarOpen, currentUser } = useApp();

  const filteredMenuItems = menuItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  const handleMenuClick = (itemId: string) => {
    setActiveView(itemId);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Academico</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          {currentUser && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {currentUser.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role === 'admin' ? 'Yönetici' : 
                     currentUser.role === 'finance' ? 'Finans' :
                     currentUser.role === 'coach' ? 'Koç' : 'Operasyon'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredMenuItems.map((item) => {
                const IconComponent = iconComponents[item.icon];
                const isActive = activeView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleMenuClick(item.id)}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200
                        ${isActive 
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <IconComponent className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200">
              <LogOut className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};