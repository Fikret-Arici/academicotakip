import React from 'react';
import { Clock, User, CreditCard, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ActivityItem {
  id: string;
  type: 'payment' | 'session' | 'overdue' | 'new_student';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

export const RecentActivity: React.FC = () => {
  const { payments, sessions, invoices, students } = useApp();

  // Generate recent activity from data
  const activities: ActivityItem[] = [
    ...payments.slice(-3).map(payment => ({
      id: `payment-${payment.id}`,
      type: 'payment' as const,
      title: 'Ödeme Alındı',
      description: `${payment.amount.toLocaleString('tr-TR')} ₺ - ${payment.method}`,
      time: new Date(payment.paidAt).toLocaleDateString('tr-TR'),
      icon: <CreditCard className="w-4 h-4" />,
      color: 'text-green-600 bg-green-50'
    })),
    ...sessions.slice(-2).map(session => ({
      id: `session-${session.id}`,
      type: 'session' as const,
      title: 'Ders Tamamlandı',
      description: session.notes || 'Ders notları eklendi',
      time: new Date(session.startAt).toLocaleDateString('tr-TR'),
      icon: <User className="w-4 h-4" />,
      color: 'text-blue-600 bg-blue-50'
    })),
    ...invoices.filter(inv => inv.status === 'overdue').slice(-2).map(invoice => ({
      id: `overdue-${invoice.id}`,
      type: 'overdue' as const,
      title: 'Vade Geçmiş Fatura',
      description: `${invoice.amountGross.toLocaleString('tr-TR')} ₺ - ${invoice.dueDate}`,
      time: new Date(invoice.dueDate).toLocaleDateString('tr-TR'),
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'text-red-600 bg-red-50'
    })),
    ...students.slice(-1).map(student => ({
      id: `student-${student.id}`,
      type: 'new_student' as const,
      title: 'Yeni Öğrenci',
      description: `${student.firstName} ${student.lastName} - ${student.grade}`,
      time: new Date(student.createdAt).toLocaleDateString('tr-TR'),
      icon: <User className="w-4 h-4" />,
      color: 'text-indigo-600 bg-indigo-50'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`flex-shrink-0 p-2 rounded-md ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>Henüz aktivite bulunmuyor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};