import React, { useState } from 'react';
import { Search, Plus, Filter, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PaymentSchedule } from '../../types';

export const PaymentScheduleList: React.FC = () => {
  const { 
    paymentSchedules, 
    students, 
    addPaymentSchedule, 
    updatePaymentSchedule, 
    deletePaymentSchedule,
    isLoading 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'due' | 'overdue' | 'paid'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<PaymentSchedule | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [scheduleData, setScheduleData] = useState({
    studentId: '',
    contractId: '',
    installmentNumber: 1,
    totalInstallments: 12,
    dueDate: '',
    amount: 0,
    status: 'upcoming' as 'upcoming' | 'due' | 'overdue' | 'paid' | 'partial',
    paidAmount: 0,
    description: ''
  });

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Bilinmeyen Öğrenci';
  };

  const filteredSchedules = paymentSchedules.filter(schedule => {
    const studentName = getStudentName(schedule.studentId).toLowerCase();
    const matchesSearch = 
      studentName.includes(searchTerm.toLowerCase()) ||
      schedule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'upcoming':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'due':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'partial':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'due':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'overdue':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'paid':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'partial':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Yaklaşan';
      case 'due': return 'Vadesi Geldi';
      case 'overdue': return 'Gecikmiş';
      case 'paid': return 'Ödendi';
      case 'partial': return 'Kısmi Ödeme';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  // Modal functions
  const openAddModal = () => {
    setEditingSchedule(null);
    setScheduleData({
      studentId: '',
      contractId: '',
      installmentNumber: 1,
      totalInstallments: 12,
      dueDate: '',
      amount: 0,
      status: 'upcoming',
      paidAmount: 0,
      description: ''
    });
    setShowModal(true);
  };

  const openEditModal = (schedule: PaymentSchedule) => {
    setEditingSchedule(schedule);
    setScheduleData({
      studentId: schedule.studentId,
      contractId: schedule.contractId,
      installmentNumber: schedule.installmentNumber,
      totalInstallments: schedule.totalInstallments,
      dueDate: schedule.dueDate.split('T')[0], // Format for input[type="date"]
      amount: schedule.amount,
      status: schedule.status,
      paidAmount: schedule.paidAmount,
      description: schedule.description
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const schedulePayload = {
        ...scheduleData,
        dueDate: new Date(scheduleData.dueDate).toISOString(),
        contractId: scheduleData.contractId || `contract_${Date.now()}`
      };

      if (editingSchedule) {
        await updatePaymentSchedule(editingSchedule.id, schedulePayload);
      } else {
        await addPaymentSchedule(schedulePayload);
      }
      
      closeModal();
    } catch (error) {
      console.error('Ödeme planı kayıt hatası:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePaymentSchedule(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Ödeme planı silme hatası:', error);
    }
  };

  const createBulkSchedules = () => {
    if (!scheduleData.studentId || !scheduleData.amount) return;
    
    const schedules = [];
    const monthlyAmount = scheduleData.amount / scheduleData.totalInstallments;
    
    for (let i = 1; i <= scheduleData.totalInstallments; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i - 1);
      
      schedules.push({
        studentId: scheduleData.studentId,
        contractId: scheduleData.contractId || `contract_${Date.now()}`,
        installmentNumber: i,
        totalInstallments: scheduleData.totalInstallments,
        dueDate: dueDate.toISOString(),
        amount: monthlyAmount,
        status: 'upcoming' as const,
        paidAmount: 0,
        description: `${i}/${scheduleData.totalInstallments} - ${scheduleData.description || 'Aylık Ödeme'}`
      });
    }
    
    // Add all schedules
    schedules.forEach(async (schedule) => {
      await addPaymentSchedule(schedule);
    });
    
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ödeme Planları</h1>
            <p className="text-gray-600">Toplam {filteredSchedules.length} ödeme planı</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Plan
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Öğrenci adı, açıklama ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="upcoming">Yaklaşan</option>
              <option value="due">Vadesi Geldi</option>
              <option value="overdue">Gecikmiş</option>
              <option value="paid">Ödendi</option>
              <option value="partial">Kısmi Ödeme</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtreler
            </button>
          </div>
        </div>
      </div>

      {/* Payment Schedule List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taksit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vade Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getStudentName(schedule.studentId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.installmentNumber} / {schedule.totalInstallments}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(schedule.dueDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(schedule.amount)}
                    </div>
                    {schedule.paidAmount > 0 && (
                      <div className="text-xs text-green-600">
                        Ödenen: {formatCurrency(schedule.paidAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(schedule.status)}>
                      {getStatusIcon(schedule.status)}
                      {getStatusText(schedule.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(schedule)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(schedule.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSchedules.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ödeme planı bulunamadı</h3>
          <p className="text-gray-600 mb-6">
            Henüz hiç ödeme planı oluşturulmamış.
          </p>
          <button 
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            İlk Planı Oluştur
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSchedule ? 'Ödeme Planı Düzenle' : 'Yeni Ödeme Planı'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öğrenci *
                  </label>
                  <select
                    required
                    value={scheduleData.studentId}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, studentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Öğrenci Seçin</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toplam Tutar (₺) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={scheduleData.amount}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taksit Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={scheduleData.totalInstallments}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, totalInstallments: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İlk Vade Tarihi *
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleData.dueDate}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {editingSchedule && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Durum
                      </label>
                      <select
                        value={scheduleData.status}
                        onChange={(e) => setScheduleData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="upcoming">Yaklaşan</option>
                        <option value="due">Vadesi Geldi</option>
                        <option value="overdue">Gecikmiş</option>
                        <option value="paid">Ödendi</option>
                        <option value="partial">Kısmi Ödeme</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ödenen Tutar (₺)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={scheduleData.paidAmount}
                        onChange={(e) => setScheduleData(prev => ({ ...prev, paidAmount: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={scheduleData.description}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Ödeme planı açıklaması..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <div>
                  {!editingSchedule && (
                    <button
                      type="button"
                      onClick={createBulkSchedules}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Toplu Plan Oluştur ({scheduleData.totalInstallments} Taksit)
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Kaydediliyor...' : (editingSchedule ? 'Güncelle' : 'Kaydet')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ödeme Planını Sil
              </h3>
              <p className="text-gray-600 mb-6">
                Bu ödeme planını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? 'Siliniyor...' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
