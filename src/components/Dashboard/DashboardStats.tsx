import React from 'react';
import { TrendingUp, TrendingDown, Users, FileText, AlertTriangle, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-md ${color}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 truncate">{title}</p>
            {change && (
              <div className={`flex items-center text-sm ${
                changeType === 'positive' ? 'text-green-600' : 
                changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : changeType === 'negative' ? (
                  <TrendingDown className="w-4 h-4 mr-1" />
                ) : null}
                {change}
              </div>
            )}
          </div>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const { dashboardStats } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: 'Aylık Gelir',
      value: formatCurrency(dashboardStats.monthlyRevenue),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: 'Aylık Gider',
      value: formatCurrency(dashboardStats.monthlyExpenses),
      change: '+8.2%',
      changeType: 'negative' as const,
      icon: <TrendingDown className="w-6 h-6 text-white" />,
      color: 'bg-red-500'
    },
    {
      title: 'Net Kâr/Zarar',
      value: formatCurrency(dashboardStats.monthlyProfit),
      changeType: dashboardStats.monthlyProfit >= 0 ? 'positive' : 'negative',
      icon: dashboardStats.monthlyProfit >= 0 ? 
        <TrendingUp className="w-6 h-6 text-white" /> : 
        <TrendingDown className="w-6 h-6 text-white" />,
      color: dashboardStats.monthlyProfit >= 0 ? 'bg-green-500' : 'bg-red-500'
    },
    {
      title: 'Tahsilat Oranı',
      value: `${dashboardStats.collectionRate}%`,
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Yaklaşan Vadeler',
      value: `${dashboardStats.upcomingDues.count} adet`,
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Geciken Ödemeler',
      value: formatCurrency(dashboardStats.overdueAmount.amount),
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
      color: 'bg-red-500'
    },
    {
      title: 'Aktif Öğrenci',
      value: dashboardStats.totalStudents.toString(),
      change: '+1',
      changeType: 'positive' as const,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-indigo-500'
    },
    {
      title: 'Aktif Sözleşme',
      value: dashboardStats.activeContracts.toString(),
      icon: <FileText className="w-6 h-6 text-white" />,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};