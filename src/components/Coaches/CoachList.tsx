import React, { useState } from 'react';
import { Search, Plus, Filter, Users, Phone, Mail, Edit2, Trash2, X, UserCheck, CreditCard, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coach, Payment } from '../../types';
import { ErrorBoundary } from '../Common/ErrorBoundary';

export const CoachList: React.FC = () => {
    const { 
    coaches, 
    students,
    payments,
    addCoach, 
    updateCoach, 
    deleteCoach, 
    isLoading 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCoach, setAssigningCoach] = useState<Coach | null>(null);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [incomeCoach, setIncomeCoach] = useState<Coach | null>(null);

  // Form state
  const [coachData, setCoachData] = useState({
    name: '',
    branch: [] as string[],
    hourlyRate: 0,
    email: '',
    phone: '',
    availability: '',
    assignedStudents: [] as string[],
    sharePercentage: 60,
    status: 'active' as 'active' | 'inactive'
  });

  const [newBranch, setNewBranch] = useState('');

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = 
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.branch.some(b => b.toLowerCase().includes(searchTerm.toLowerCase())) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || coach.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-2 py-1 rounded-full text-xs font-medium";
    return status === 'active' 
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-red-100 text-red-800`;
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Aktif' : 'Pasif';
  };



  // Modal functions
  const openAddModal = () => {
    setEditingCoach(null);
    setCoachData({
      name: '',
      branch: [],
      hourlyRate: 0,
      email: '',
      phone: '',
      availability: '',
      assignedStudents: [],
      sharePercentage: 60,
      status: 'active'
    });
    setShowModal(true);
  };

  const openEditModal = (coach: Coach) => {
    setEditingCoach(coach);
    setCoachData({
      name: coach.name,
      branch: coach.branch || [],
      hourlyRate: coach.hourlyRate,
      email: coach.email,
      phone: coach.phone,
      availability: coach.availability,
      assignedStudents: coach.assignedStudents || [],
      sharePercentage: coach.sharePercentage || 60,
      status: coach.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoach(null);
    setNewBranch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCoach) {
        await updateCoach(editingCoach.id, coachData);
      } else {
        await addCoach(coachData);
      }
      
      closeModal();
    } catch (error) {
      console.error('Koç kayıt hatası:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCoach(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Koç silme hatası:', error);
    }
  };

  const addBranch = () => {
    if (newBranch.trim() && !coachData.branch.includes(newBranch.trim())) {
      setCoachData(prev => ({
        ...prev,
        branch: [...prev.branch, newBranch.trim()]
      }));
      setNewBranch('');
    }
  };

  const removeBranch = (branchToRemove: string) => {
    setCoachData(prev => ({
      ...prev,
      branch: prev.branch.filter(branch => branch !== branchToRemove)
    }));
  };

  const openAssignStudentModal = (coach: Coach) => {
    console.log('Öğrenci atama modalı açılıyor:', coach);
    setAssigningCoach(coach);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
    setAssigningCoach(null);
  };

  const openIncomeModal = (coach: Coach) => {
    console.log('Gelir raporu modalı açılıyor:', coach);
    setIncomeCoach(coach);
    setShowIncomeModal(true);
  };

  const closeIncomeModal = () => {
    setShowIncomeModal(false);
    setIncomeCoach(null);
  };

  const handleAssignStudent = async (studentId: string, assign: boolean) => {
    if (!assigningCoach) return;
    
    try {
      console.log('Öğrenci atama başlatılıyor:', { studentId, assign, coachId: assigningCoach.id });
      
      const currentAssignments = assigningCoach.assignedStudents || [];
      let newAssignments;
      
      if (assign) {
        if (currentAssignments.includes(studentId)) {
          console.log('Öğrenci zaten atanmış');
          return;
        }
        newAssignments = [...currentAssignments, studentId];
      } else {
        newAssignments = currentAssignments.filter(id => id !== studentId);
      }
      
      console.log('Yeni atamalar:', newAssignments);
      
      // Only update the assignedStudents field
      const updateData = {
        ...assigningCoach,
        assignedStudents: newAssignments
      };
      
      await updateCoach(assigningCoach.id, updateData);
      
      console.log('Koç güncelleme başarılı');
      
      // Update local state
      setAssigningCoach(prev => prev ? {
        ...prev,
        assignedStudents: newAssignments
      } : null);
      
    } catch (error) {
      console.error('Öğrenci atama hatası:', error);
      alert('Öğrenci atama sırasında hata oluştu: ' + (error as Error).message);
    }
  };

  return (
    <ErrorBoundary>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserCheck className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Koçlar</h1>
            <p className="text-gray-600">Toplam {filteredCoaches.length} koç</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Koç
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
                placeholder="Koç adı, branş, e-posta ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
            
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtreler
            </button>
          </div>
        </div>
      </div>

      {/* Coach List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCoaches.map((coach) => {
          return (
            <div key={coach.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {coach.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {coach.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {coach.branch.join(', ')}
                    </p>
                  </div>
                </div>
                <span className={getStatusBadge(coach.status)}>
                  {getStatusText(coach.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{coach.phone}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{coach.email}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>
                    {coach.assignedStudents?.length || 0} öğrenci
                  </span>
                </div>
                
                {coach.assignedStudents && coach.assignedStudents.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Öğrenciler:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {coach.assignedStudents.map(studentId => {
                        const student = students.find(s => s.id === studentId);
                        return student ? (
                          <span key={studentId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {student.firstName} {student.lastName}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Saatlik Ücret: <span className="font-medium text-gray-900">₺{coach.hourlyRate}</span>
                  </span>
                  <span className="text-gray-600">
                    Payı: <span className="font-medium text-gray-900">%{coach.sharePercentage || 60}</span>
                  </span>
                </div>

                {coach.availability && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Müsaitlik:</span> {coach.availability}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => openEditModal(coach)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={() => openAssignStudentModal(coach)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Öğrenci Ata
                    </button>
                    <button 
                      onClick={() => openIncomeModal(coach)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      Gelir Raporu
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(coach)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(coach.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCoaches.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Koç bulunamadı</h3>
          <p className="text-gray-600 mb-6">
            Arama kriterlerinize uygun koç bulunmuyor.
          </p>
          <button 
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yeni Koç Ekle
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
                  {editingCoach ? 'Koç Düzenle' : 'Yeni Koç Ekle'}
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
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={coachData.name}
                    onChange={(e) => setCoachData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saatlik Ücret (₺) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={coachData.hourlyRate}
                    onChange={(e) => setCoachData(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={coachData.email}
                    onChange={(e) => setCoachData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={coachData.phone}
                    onChange={(e) => setCoachData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+90 555 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paylaşım Oranı (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={coachData.sharePercentage}
                    onChange={(e) => setCoachData(prev => ({ ...prev, sharePercentage: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={coachData.status}
                    onChange={(e) => setCoachData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müsaitlik
                </label>
                <textarea
                  value={coachData.availability}
                  onChange={(e) => setCoachData(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Örn: Pazartesi-Cuma 09:00-18:00"
                />
              </div>

              {/* Branşlar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branşlar
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBranch())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Branş ekle..."
                  />
                  <button
                    type="button"
                    onClick={addBranch}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Ekle
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {coachData.branch.map((branch, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {branch}
                      <button
                        type="button"
                        onClick={() => removeBranch(branch)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                  {isLoading ? 'Kaydediliyor...' : (editingCoach ? 'Güncelle' : 'Kaydet')}
                </button>
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
                Koçu Sil
              </h3>
              <p className="text-gray-600 mb-6">
                Bu koçu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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

      {/* Income Report Modal */}
      {showIncomeModal && incomeCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gelir Raporu - {incomeCoach.name}
                </h2>
                <button
                  onClick={closeIncomeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {(() => {
                // Bu koça ait öğrenciler
                const coachStudents = students.filter(student => student.coachId === incomeCoach.id);
                
                // Bu koça ait ödemeler (gerçek ödemeler + potansiyel aylık gelir)
                const coachPayments = payments.filter((payment: Payment) => {
                  // Koçun öğrencilerinden gelen ödemeler
                  const paymentStudent = students.find(student => 
                    payment.invoiceId.includes(student.id) || 
                    student.coachId === incomeCoach.id
                  );
                  return paymentStudent && paymentStudent.coachId === incomeCoach.id;
                });

                // Potansiyel aylık gelir hesapla
                const monthlyPotential = coachStudents.reduce((sum, student) => {
                  return sum + (student.monthlyFee || 0);
                }, 0);

                const totalRevenue = coachPayments.reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
                const totalCoachShare = coachPayments.reduce((sum: number, payment: Payment) => sum + (payment.coachShare || 0), 0);
                const totalManagementShare = coachPayments.reduce((sum: number, payment: Payment) => sum + (payment.managementShare || 0), 0);

                const formatCurrency = (amount: number) => {
                  return new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                  }).format(amount);
                };

                return (
                  <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600">Toplam Gelir</p>
                            <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalRevenue)}</p>
                            <p className="text-xs text-blue-600">{coachPayments.length} ödeme</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <UserCheck className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-green-600">Koç Payı</p>
                            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalCoachShare)}</p>
                            <p className="text-xs text-green-600">%{incomeCoach.sharePercentage} oranında</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <CreditCard className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-purple-600">Yönetim Payı</p>
                            <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalManagementShare)}</p>
                            <p className="text-xs text-purple-600">%{100 - incomeCoach.sharePercentage} oranında</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-6">
                        <div className="flex items-center">
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-yellow-600">Aylık Potansiyel</p>
                            <p className="text-2xl font-bold text-yellow-900">{formatCurrency(monthlyPotential)}</p>
                            <p className="text-xs text-yellow-600">{coachStudents.length} öğrenci</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coach Info */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Koç Bilgileri</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Branşlar</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {incomeCoach.branch.map((branch, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {branch}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Saatlik Ücret</p>
                          <p className="font-medium text-gray-900">{formatCurrency(incomeCoach.hourlyRate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Atanmış Öğrenci Sayısı</p>
                          <p className="font-medium text-gray-900">{coachStudents.length} öğrenci</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pay Oranı</p>
                          <p className="font-medium text-gray-900">%{incomeCoach.sharePercentage}</p>
                        </div>
                      </div>
                    </div>

                    {/* Student List */}
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Atanmış Öğrenciler ({coachStudents.length})</h3>
                      </div>
                      
                      {coachStudents.length > 0 ? (
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {coachStudents.map((student) => (
                              <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {student.firstName} {student.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {student.grade} - {student.school}
                                    </p>
                                    {student.monthlyFee && (
                                      <p className="text-sm text-green-600 font-medium">
                                        Aylık: {formatCurrency(student.monthlyFee)}
                                        {student.paymentDay && (
                                          <span className="text-gray-500 ml-1">
                                            ({student.paymentDay}. gün)
                                          </span>
                                        )}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                      student.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {student.status === 'active' ? 'Aktif' : 'Pasif'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Bu koça henüz öğrenci atanmamış.</p>
                        </div>
                      )}
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-lg border border-gray-200">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Ödeme Geçmişi</h3>
                      </div>
                      
                      {coachPayments.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Tarih
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Toplam Tutar
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
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {coachPayments.map((payment: Payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {new Date(payment.paidAt).toLocaleDateString('tr-TR')}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(payment.amount)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                    {formatCurrency(payment.coachShare || 0)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                                    {formatCurrency(payment.managementShare || 0)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                      payment.method === 'cash' ? 'bg-green-100 text-green-800' :
                                      payment.method === 'transfer' ? 'bg-blue-100 text-blue-800' :
                                      'bg-purple-100 text-purple-800'
                                    }`}>
                                      {payment.method === 'cash' ? 'Nakit' : 
                                       payment.method === 'transfer' ? 'Havale' : 'Kart'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Bu koça ait henüz ödeme kaydı bulunmuyor.</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
                </div>
                <button
                  onClick={closeIncomeModal}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {showAssignModal && assigningCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Öğrenci Ataması - {assigningCoach.name}
                </h2>
                <button
                  onClick={closeAssignModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Mevcut Öğrenciler ({assigningCoach.assignedStudents?.length || 0})
                </h3>
                <p className="text-sm text-gray-600">
                  Koçun şu anda atanmış olduğu öğrenciler ve yeni öğrenci atama seçenekleri.
                </p>
              </div>

              <div className="space-y-4">
                {students.map(student => {
                  const isAssigned = assigningCoach.assignedStudents?.includes(student.id) || false;
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.grade} - {student.school}
                          </p>
                          {student.tags && student.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {student.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {isAssigned && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Atanmış
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleAssignStudent(student.id, !isAssigned)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isAssigned
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {isAssigned ? 'Kaldır' : 'Ata'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {students.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Henüz hiç öğrenci bulunmuyor.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Toplam {assigningCoach.assignedStudents?.length || 0} öğrenci atanmış
                </div>
                <button
                  onClick={closeAssignModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {showAssignModal && assigningCoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Öğrenci Ataması - {assigningCoach.name}
                </h2>
                <button
                  onClick={closeAssignModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {students.map(student => {
                  const isAssigned = assigningCoach.assignedStudents?.includes(student.id) || false;
                  
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {student.grade} - {student.school}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {isAssigned && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Atanmış
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleAssignStudent(student.id, !isAssigned)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            isAssigned
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {isAssigned ? 'Kaldır' : 'Ata'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={closeAssignModal}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
};