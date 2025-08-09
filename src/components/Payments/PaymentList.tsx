import React, { useState } from 'react';
import { Search, Plus, Filter, CreditCard, TrendingUp, Users, Calendar, Eye, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment } from '../../types';

export const PaymentList: React.FC = () => {
  const { 
    payments, 
    students, 
    coaches,
    paymentSchedules,
    addPayment,
    isLoading 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<'all' | 'cash' | 'transfer' | 'card'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new payment
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    amount: 0,
    method: 'transfer' as 'cash' | 'transfer' | 'card',
    reference: '',
    coachId: '',
    description: ''
  });

  const getStudentName = (invoiceId: string) => {
    // In a real app, you'd get student from invoice
    const student = students[0]; // Placeholder
    return student ? `${student.firstName} ${student.lastName}` : 'Bilinmeyen Öğrenci';
  };

  const getCoachName = (coachId: string) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : 'Bilinmeyen Koç';
  };

  const filteredPayments = payments.filter(payment => {
    const studentName = getStudentName(payment.invoiceId).toLowerCase();
    const matchesSearch = 
      studentName.includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesMethod;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMethodBadge = (method: string) => {
    const baseClasses = "inline-flex px-2 py-1 rounded-full text-xs font-medium";
    switch (method) {
      case 'cash':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'transfer':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'card':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'cash': return 'Nakit';
      case 'transfer': return 'Havale';
      case 'card': return 'Kart';
      default: return method;
    }
  };

  // Calculate statistics
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalCoachShare = filteredPayments.reduce((sum, payment) => sum + (payment.coachShare || 0), 0);
  const totalManagementShare = filteredPayments.reduce((sum, payment) => sum + (payment.managementShare || 0), 0);

  const openPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const openAddModal = () => {
    setPaymentData({
      studentId: '',
      amount: 0,
      method: 'transfer',
      reference: '',
      coachId: '',
      description: ''
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const coach = coaches.find(c => c.id === paymentData.coachId);
      const coachSharePercentage = coach?.sharePercentage || 60;
      const coachShare = (paymentData.amount * coachSharePercentage) / 100;
      const managementShare = paymentData.amount - coachShare;

      const newPayment = {
        invoiceId: `invoice_${Date.now()}`, // In real app, link to actual invoice
        paidAt: new Date().toISOString(),
        amount: paymentData.amount,
        method: paymentData.method,
        reference: paymentData.reference || `REF${Date.now()}`,
        coachShare,
        managementShare,
        coachSharePercentage,
        description: paymentData.description
      };

      await addPayment(newPayment);
      closeAddModal();
    } catch (error) {
      console.error('Ödeme ekleme hatası:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CreditCard className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ödemeler & Gelir Dağılımı</h1>
            <p className="text-gray-600">Toplam {filteredPayments.length} ödeme</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Ödeme
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Koç Payı</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCoachShare)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Yönetim Payı</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalManagementShare)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bu Ay</p>
              <p className="text-2xl font-bold text-gray-900">{filteredPayments.length}</p>
              <p className="text-sm text-gray-500">ödeme</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Öğrenci adı, referans ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Yöntemler</option>
              <option value="cash">Nakit</option>
              <option value="transfer">Havale</option>
              <option value="card">Kart</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtreler
            </button>
          </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öğrenci
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Koç Payı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yönetim Payı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yöntem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getStudentName(payment.invoiceId)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ref: {payment.reference}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(payment.coachShare || 0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      %{payment.coachSharePercentage || 60}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">
                      {formatCurrency(payment.managementShare || 0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      %{100 - (payment.coachSharePercentage || 60)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getMethodBadge(payment.method)}>
                      {getMethodText(payment.method)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(payment.paidAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openPaymentDetails(payment)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Detaylar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ödeme bulunamadı</h3>
          <p className="text-gray-600 mb-6">
            Henüz hiç ödeme kaydı bulunmuyor.
          </p>
          <button 
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            İlk Ödemeyi Kaydet
          </button>
        </div>
      )}

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Ödeme Detayları
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ödeme Bilgileri</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Öğrenci</p>
                      <p className="font-medium">{getStudentName(selectedPayment.invoiceId)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Toplam Tutar</p>
                      <p className="font-bold text-lg">{formatCurrency(selectedPayment.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ödeme Yöntemi</p>
                      <span className={getMethodBadge(selectedPayment.method)}>
                        {getMethodText(selectedPayment.method)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Referans</p>
                      <p className="font-medium">{selectedPayment.reference}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ödeme Tarihi</p>
                      <p className="font-medium">{formatDate(selectedPayment.paidAt)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Gelir Dağılımı</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Koç Payı</p>
                      <p className="font-bold text-green-700 text-lg">
                        {formatCurrency(selectedPayment.coachShare || 0)}
                      </p>
                      <p className="text-xs text-green-600">
                        %{selectedPayment.coachSharePercentage || 60} oranında
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Yönetim Payı</p>
                      <p className="font-bold text-blue-700 text-lg">
                        {formatCurrency(selectedPayment.managementShare || 0)}
                      </p>
                      <p className="text-xs text-blue-600">
                        %{100 - (selectedPayment.coachSharePercentage || 60)} oranında
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Yeni Ödeme Ekle
                </h2>
                <button
                  onClick={closeAddModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddPayment} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öğrenci *
                  </label>
                  <select
                    required
                    value={paymentData.studentId}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, studentId: e.target.value }))}
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
                    Koç *
                  </label>
                  <select
                    required
                    value={paymentData.coachId}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, coachId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Koç Seçin</option>
                    {coaches.map(coach => (
                      <option key={coach.id} value={coach.id}>
                        {coach.name} (%{coach.sharePercentage || 60})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutar (₺) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Yöntemi *
                  </label>
                  <select
                    required
                    value={paymentData.method}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="transfer">Havale</option>
                    <option value="cash">Nakit</option>
                    <option value="card">Kart</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referans
                  </label>
                  <input
                    type="text"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, reference: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ödeme referans numarası"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={paymentData.description}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Ödeme açıklaması..."
                  />
                </div>
              </div>

              {/* Preview */}
              {paymentData.amount > 0 && paymentData.coachId && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Gelir Dağılımı Önizleme:</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Koç Payı</p>
                      <p className="font-bold text-green-600">
                        {formatCurrency((paymentData.amount * (coaches.find(c => c.id === paymentData.coachId)?.sharePercentage || 60)) / 100)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Yönetim Payı</p>
                      <p className="font-bold text-blue-600">
                        {formatCurrency(paymentData.amount - (paymentData.amount * (coaches.find(c => c.id === paymentData.coachId)?.sharePercentage || 60)) / 100)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeAddModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
