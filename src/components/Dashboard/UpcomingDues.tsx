import React from 'react';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const UpcomingDues: React.FC = () => {
  const { invoices, students, contracts } = useApp();

  // Get upcoming and overdue invoices
  const upcomingInvoices = invoices.filter(invoice => {
    if (invoice.status === 'paid') return false;
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= today && dueDate <= weekFromNow;
  });

  const overdueInvoices = invoices.filter(invoice => 
    invoice.status === 'overdue' || 
    (invoice.status === 'pending' && new Date(invoice.dueDate) < new Date())
  );

  const getStudentName = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return 'Bilinmeyen';
    const student = students.find(s => s.id === contract.studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Bilinmeyen';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Vadeler</h3>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {/* Overdue invoices */}
          {overdueInvoices.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                <h4 className="text-sm font-medium text-red-700">Vadesi Geçmiş ({overdueInvoices.length})</h4>
              </div>
              <div className="space-y-3">
                {overdueInvoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getStudentName(invoice.contractId)}
                        </p>
                        <p className="text-xs text-gray-600">
                          Vade: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-red-700">
                          {formatCurrency(invoice.balance)}
                        </p>
                        <p className="text-xs text-red-600">
                          {Math.abs(getDaysUntilDue(invoice.dueDate))} gün geçmiş
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming invoices */}
          {upcomingInvoices.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                <h4 className="text-sm font-medium text-yellow-700">Yaklaşan Vadeler ({upcomingInvoices.length})</h4>
              </div>
              <div className="space-y-3">
                {upcomingInvoices.slice(0, 4).map((invoice) => {
                  const daysUntilDue = getDaysUntilDue(invoice.dueDate);
                  return (
                    <div key={invoice.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getStudentName(invoice.contractId)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Vade: {formatDate(invoice.dueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-yellow-700">
                            {formatCurrency(invoice.balance)}
                          </p>
                          <p className="text-xs text-yellow-600">
                            {daysUntilDue} gün kaldı
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {overdueInvoices.length === 0 && upcomingInvoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Yaklaşan vade bulunmuyor</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
              Tüm Faturaları Görüntüle →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};