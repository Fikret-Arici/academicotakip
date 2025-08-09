import React from 'react';
import { TrendingUp, TrendingDown, Users, CreditCard, AlertTriangle, DollarSign, UserCheck, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, change, changeType, icon, color }) => {
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
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const { students, coaches, payments, paymentSchedules } = useApp();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate real-time statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const totalCoaches = coaches.length;
  const activeCoaches = coaches.filter(c => c.status === 'active').length;

  // Payment statistics
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCoachShare = payments.reduce((sum, payment) => sum + (payment.coachShare || 0), 0);
  const totalManagementShare = payments.reduce((sum, payment) => sum + (payment.managementShare || 0), 0);

  // Payment schedule statistics
  const upcomingPayments = paymentSchedules.filter(p => p.status === 'upcoming').length;
  const overduePayments = paymentSchedules.filter(p => p.status === 'overdue').length;
  const upcomingAmount = paymentSchedules
    .filter(p => p.status === 'upcoming')
    .reduce((sum, p) => sum + p.amount, 0);
  const overdueAmount = paymentSchedules
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    {
      title: 'Toplam Gelir',
      value: formatCurrency(totalRevenue),
      subtitle: `${payments.length} ödeme`,
      change: totalRevenue > 0 ? '+' + formatCurrency(totalRevenue) : undefined,
      changeType: 'positive' as const,
      icon: <DollarSign className="w-6 h-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: 'Aktif Öğrenci',
      value: activeStudents.toString(),
      subtitle: `Toplam ${totalStudents}`,
      change: activeStudents > 0 ? `+${activeStudents}` : undefined,
      changeType: 'positive' as const,
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Aktif Koç',
      value: activeCoaches.toString(),
      subtitle: `Toplam ${totalCoaches}`,
      icon: <UserCheck className="w-6 h-6 text-white" />,
      color: 'bg-indigo-500'
    },
    {
      title: 'Geciken Ödemeler',
      value: overduePayments.toString(),
      subtitle: formatCurrency(overdueAmount),
      changeType: overduePayments > 0 ? 'negative' : 'neutral',
      icon: <AlertTriangle className="w-6 h-6 text-white" />,
      color: overduePayments > 0 ? 'bg-red-500' : 'bg-gray-500'
    },
    {
      title: 'Koç Payı',
      value: formatCurrency(totalCoachShare),
      subtitle: totalRevenue > 0 ? `%${Math.round((totalCoachShare / totalRevenue) * 100)} oranında` : '0%',
      icon: <Users className="w-6 h-6 text-white" />,
      color: 'bg-green-500'
    },
    {
      title: 'Yönetim Payı',
      value: formatCurrency(totalManagementShare),
      subtitle: totalRevenue > 0 ? `%${Math.round((totalManagementShare / totalRevenue) * 100)} oranında` : '0%',
      icon: <CreditCard className="w-6 h-6 text-white" />,
      color: 'bg-purple-500'
    },
    {
      title: 'Yaklaşan Ödemeler',
      value: upcomingPayments.toString(),
      subtitle: formatCurrency(upcomingAmount),
      icon: <Calendar className="w-6 h-6 text-white" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Net Kâr',
      value: formatCurrency(totalManagementShare), // Management share as profit
      subtitle: 'Bu ay',
      changeType: totalManagementShare > 0 ? 'positive' : 'neutral',
      icon: totalManagementShare > 0 ? 
        <TrendingUp className="w-6 h-6 text-white" /> : 
        <TrendingDown className="w-6 h-6 text-white" />,
      color: totalManagementShare > 0 ? 'bg-green-500' : 'bg-gray-500'
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