import React from 'react';
import { DashboardStats } from './DashboardStats';
import { RecentActivity } from './RecentActivity';
import { UpcomingDues } from './UpcomingDues';
import { RevenueChart } from './RevenueChart';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <select className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <option>Bu Ay</option>
            <option>Son 3 Ay</option>
            <option>Bu Yıl</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Rapor İndir
          </button>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <UpcomingDues />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Koç Performansı</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Dr. Ahmet Şen</p>
                <p className="text-sm text-gray-600">Matematik, Fizik</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">24 saat</p>
                <p className="text-sm text-green-600">%95 tamamlama</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Prof. Elif Arslan</p>
                <p className="text-sm text-gray-600">Kimya, Biyoloji</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">18 saat</p>
                <p className="text-sm text-green-600">%88 tamamlama</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Öğr. Gör. Serkan Yılmaz</p>
                <p className="text-sm text-gray-600">Türkçe, Tarih</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">16 saat</p>
                <p className="text-sm text-green-600">%92 tamamlama</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};