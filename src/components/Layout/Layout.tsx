import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Dashboard } from '../Dashboard/Dashboard';
import { StudentList } from '../Students/StudentList';
import { InvoiceList } from '../Invoices/InvoiceList';
import { useApp } from '../../context/AppContext';

export const Layout: React.FC = () => {
  const { activeView, sidebarOpen } = useApp();

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentList />;
      case 'invoices':
        return <InvoiceList />;
      case 'coaches':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Koçlar</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Koç yönetimi modülü yakında kullanıma açılacak.</p>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hizmetler & Paketler</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Hizmet ve paket yönetimi modülü yakında kullanıma açılacak.</p>
            </div>
          </div>
        );
      case 'contracts':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Sözleşmeler</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Sözleşme yönetimi modülü yakında kullanıma açılacak.</p>
            </div>
          </div>
        );
      case 'expenses':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Giderler</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Gider yönetimi modülü yakında kullanıma açılacak.</p>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Takvim</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Takvim modülü yakında kullanıma açılacak.</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Raporlar</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Raporlama modülü yakında kullanıma açılacak.</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ayarlar</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">Ayarlar modülü yakında kullanıma açılacak.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:ml-64 transition-all duration-300 ease-in-out">
        <Header />
        
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};