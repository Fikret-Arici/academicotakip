import React, { useState } from 'react';
import { Search, Plus, Filter, Users, Phone, Mail, Tag, Edit2, Trash2, X, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';

export const StudentList: React.FC = () => {
  const { 
    students, 
    parents,
    coaches, 
    addStudent, 
    updateStudent, 
    deleteStudent, 
    addParent, 
    updateParent,
    isLoading 
  } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    school: '',
    status: 'active' as 'active' | 'inactive',
    tags: [] as string[],
    parentId: '',
    // Ödeme bilgileri
    coachId: '',
    monthlyFee: 0,
    paymentDay: 1,
    totalAmount: 0,
    installments: 12,
    startDate: '',
    endDate: ''
  });

  const [parentData, setParentData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredChannel: 'phone' as 'phone' | 'whatsapp' | 'email',
    kvkkConsent: true
  });

  const getParentInfo = (parentId: string) => {
    return parents.find(p => p.id === parentId);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.school.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
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
    setEditingStudent(null);
    setStudentData({
      firstName: '',
      lastName: '',
      grade: '',
      school: '',
      status: 'active',
      tags: [],
      parentId: '',
      // Ödeme bilgileri
      coachId: '',
      monthlyFee: 0,
      paymentDay: 1,
      totalAmount: 0,
      installments: 12,
      startDate: '',
      endDate: ''
    });
    setParentData({
      name: '',
      phone: '',
      email: '',
      preferredChannel: 'phone',
      kvkkConsent: true
    });
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setStudentData({
      firstName: student.firstName,
      lastName: student.lastName,
      grade: student.grade,
      school: student.school,
      status: student.status,
      tags: student.tags || [],
      parentId: student.parentId,
      // Ödeme bilgileri
      coachId: student.coachId || '',
      monthlyFee: student.monthlyFee || 0,
      paymentDay: student.paymentDay || 1,
      totalAmount: student.totalAmount || 0,
      installments: student.installments || 12,
      startDate: student.startDate || '',
      endDate: student.endDate || ''
    });
    
    const parent = getParentInfo(student.parentId);
    if (parent) {
      setParentData({
        name: parent.name,
        phone: parent.phone,
        email: parent.email,
        preferredChannel: parent.preferredChannel,
        kvkkConsent: parent.kvkkConsent
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let parentId = studentData.parentId;
      
      // Eğer yeni veli ise ekle
      if (!parentId && parentData.name && parentData.phone) {
        parentId = await addParent(parentData);
      } else if (parentId && editingStudent) {
        // Mevcut veliyi güncelle
        await updateParent(parentId, parentData);
      }

      const studentPayload = {
        ...studentData,
        parentId
      };

      if (editingStudent) {
        await updateStudent(editingStudent.id, studentPayload);
      } else {
        await addStudent(studentPayload);
      }
      
      closeModal();
    } catch (error) {
      console.error('Kayıt hatası:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !studentData.tags.includes(tag.trim())) {
      setStudentData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setStudentData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Öğrenciler & Veliler</h1>
            <p className="text-gray-600">Toplam {filteredStudents.length} öğrenci</p>
          </div>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Öğrenci
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
                placeholder="Öğrenci adı, okul ara..."
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

      {/* Student List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => {
          const parent = getParentInfo(student.parentId);
          
          return (
            <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{student.grade}</p>
                  </div>
                </div>
                <span className={getStatusBadge(student.status)}>
                  {getStatusText(student.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{student.school}</span>
                </div>

                {parent && (
                  <>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{parent.name} - {parent.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{parent.email}</span>
                    </div>
                  </>
                )}

                {student.tags.length > 0 && (
                  <div className="flex items-start text-sm text-gray-600">
                    <Tag className="w-4 h-4 mr-2 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      {student.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Koç Bilgisi */}
                {student.coachId && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      Koç: <span className="font-medium text-blue-600">
                        {coaches.find(c => c.id === student.coachId)?.name || 'Bilinmeyen Koç'}
                      </span>
                    </span>
                  </div>
                )}

                {/* Ödeme Bilgisi */}
                {student.monthlyFee && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2" />
                    <span>
                      Aylık: <span className="font-medium text-green-600">₺{student.monthlyFee}</span>
                      {student.paymentDay && (
                        <span className="text-gray-500 ml-1">
                          (Her ayın {student.paymentDay}. günü)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Detaylar
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Sözleşmeler
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Ödemeler
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(student)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(student.id)}
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

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Öğrenci bulunamadı</h3>
          <p className="text-gray-600 mb-6">
            Arama kriterlerinize uygun öğrenci bulunmuyor.
          </p>
          <button 
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yeni Öğrenci Ekle
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
                  {editingStudent ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'}
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
              {/* Öğrenci Bilgileri */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Öğrenci Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentData.firstName}
                      onChange={(e) => setStudentData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentData.lastName}
                      onChange={(e) => setStudentData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sınıf *
                    </label>
                    <select
                      required
                      value={studentData.grade}
                      onChange={(e) => setStudentData(prev => ({ ...prev, grade: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sınıf Seçin</option>
                      <option value="9. Sınıf">9. Sınıf</option>
                      <option value="10. Sınıf">10. Sınıf</option>
                      <option value="11. Sınıf">11. Sınıf</option>
                      <option value="12. Sınıf">12. Sınıf</option>
                      <option value="Mezun">Mezun</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Okul *
                    </label>
                    <input
                      type="text"
                      required
                      value={studentData.school}
                      onChange={(e) => setStudentData(prev => ({ ...prev, school: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durum
                    </label>
                    <select
                      value={studentData.status}
                      onChange={(e) => setStudentData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Aktif</option>
                      <option value="inactive">Pasif</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Veli Bilgileri */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Veli Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Veli Adı *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentData.name}
                      onChange={(e) => setParentData(prev => ({ ...prev, name: e.target.value }))}
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
                      value={parentData.phone}
                      onChange={(e) => setParentData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+90 555 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={parentData.email}
                      onChange={(e) => setParentData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İletişim Tercihi
                    </label>
                    <select
                      value={parentData.preferredChannel}
                      onChange={(e) => setParentData(prev => ({ ...prev, preferredChannel: e.target.value as 'phone' | 'whatsapp' | 'email' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="phone">Telefon</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="email">E-posta</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ödeme Bilgileri */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ödeme & Kurs Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Koç Seçimi *
                    </label>
                    <select
                      required
                      value={studentData.coachId}
                      onChange={(e) => setStudentData(prev => ({ ...prev, coachId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Koç Seçin</option>
                      {coaches.filter(c => c.status === 'active').map(coach => (
                        <option key={coach.id} value={coach.id}>
                          {coach.name} - {coach.branch.join(', ')} (₺{coach.hourlyRate}/saat)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aylık Ücret (₺) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={studentData.monthlyFee}
                      onChange={(e) => setStudentData(prev => ({ ...prev, monthlyFee: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Aylık ödeme tutarı"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ödeme Günü (Ayın kaçı)
                    </label>
                    <select
                      value={studentData.paymentDay}
                      onChange={(e) => setStudentData(prev => ({ ...prev, paymentDay: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                          {day}. gün
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toplam Kurs Ücreti (₺)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={studentData.totalAmount}
                      onChange={(e) => setStudentData(prev => ({ ...prev, totalAmount: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Toplam kurs ücreti"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taksit Sayısı
                    </label>
                    <select
                      value={studentData.installments}
                      onChange={(e) => setStudentData(prev => ({ ...prev, installments: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 9, 10, 12, 18, 24].map(months => (
                        <option key={months} value={months}>
                          {months} taksit
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kursa Başlama Tarihi
                    </label>
                    <input
                      type="date"
                      value={studentData.startDate}
                      onChange={(e) => setStudentData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kurs Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={studentData.endDate}
                      onChange={(e) => setStudentData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Ödeme Özeti */}
                {studentData.monthlyFee > 0 && studentData.coachId && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Ödeme Özeti:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Aylık Ödeme:</span>
                        <p className="font-medium">₺{studentData.monthlyFee}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Koç Payı (%{coaches.find(c => c.id === studentData.coachId)?.sharePercentage || 60}):</span>
                        <p className="font-medium text-green-600">
                          ₺{((studentData.monthlyFee * (coaches.find(c => c.id === studentData.coachId)?.sharePercentage || 60)) / 100).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Yönetim Payı (%{100 - (coaches.find(c => c.id === studentData.coachId)?.sharePercentage || 60)}):</span>
                        <p className="font-medium text-blue-600">
                          ₺{(studentData.monthlyFee - ((studentData.monthlyFee * (coaches.find(c => c.id === studentData.coachId)?.sharePercentage || 60)) / 100)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
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
                  {isLoading ? 'Kaydediliyor...' : (editingStudent ? 'Güncelle' : 'Kaydet')}
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
                Öğrenciyi Sil
              </h3>
              <p className="text-gray-600 mb-6">
                Bu öğrenciyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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