'use client';

import React, { useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPercent,
  FaTag,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaClock,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

// Discount type
interface Discount {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  applicableProducts: 'all' | string[]; // 'all' or array of product IDs
}

// Sample discounts data
const discountsData: Discount[] = [
  {
    id: '1',
    code: 'WELCOME20',
    description: 'Diskon 20% untuk pelanggan baru',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 30000,
    maxDiscount: 15000,
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    isActive: true,
    usageLimit: 1,
    usageCount: 12,
    applicableProducts: 'all',
  },
  {
    id: '2',
    code: 'HEMAT10K',
    description: 'Potongan langsung Rp 10.000',
    discountType: 'fixed',
    discountValue: 10000,
    minOrder: 50000,
    startDate: '2024-03-10T00:00:00Z',
    endDate: '2024-03-25T23:59:59Z',
    isActive: true,
    usageLimit: 100,
    usageCount: 45,
    applicableProducts: 'all',
  },
  {
    id: '3',
    code: 'MAKAN5',
    description: 'Diskon 5% untuk semua makanan',
    discountType: 'percentage',
    discountValue: 5,
    minOrder: 0,
    startDate: '2024-03-01T00:00:00Z',
    endDate: '2024-04-30T23:59:59Z',
    isActive: true,
    usageCount: 78,
    applicableProducts: ['1', '2', '4', '5', '7', '8'], // Makanan saja
  },
  {
    id: '4',
    code: 'SPESIAL25',
    description: 'Diskon 25% untuk pembelian min. Rp 100.000',
    discountType: 'percentage',
    discountValue: 25,
    minOrder: 100000,
    maxDiscount: 30000,
    startDate: '2024-02-15T00:00:00Z',
    endDate: '2024-03-10T23:59:59Z',
    isActive: false, // Expired
    usageCount: 32,
    applicableProducts: 'all',
  },
  {
    id: '5',
    code: 'RAMADHAN15',
    description: 'Diskon 15% selama bulan Ramadhan',
    discountType: 'percentage',
    discountValue: 15,
    minOrder: 25000,
    maxDiscount: 20000,
    startDate: '2024-04-01T00:00:00Z',
    endDate: '2024-04-30T23:59:59Z',
    isActive: false, // Not started yet
    usageCount: 0,
    applicableProducts: 'all',
  },
];

const AdminDiscountsPage = () => {
  const [discounts, setDiscounts] = useState<Discount[]>(discountsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<'code' | 'startDate' | 'endDate' | null>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Check if a discount is active (not expired, not future)
  const isDiscountActive = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    return (
      discount.isActive &&
      startDate <= now &&
      endDate >= now
    );
  };

  // Get discount status display
  const getDiscountStatus = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);

    if (!discount.isActive) {
      return {
        text: 'Tidak Aktif',
        color: 'bg-secondary-100 text-secondary-800',
      };
    }

    if (now < startDate) {
      return {
        text: 'Akan Datang',
        color: 'bg-blue-100 text-blue-800',
      };
    }

    if (now > endDate) {
      return {
        text: 'Kedaluwarsa',
        color: 'bg-red-100 text-red-800',
      };
    }

    return {
      text: 'Aktif',
      color: 'bg-green-100 text-green-800',
    };
  };

  // Filter and sort discounts
  const filteredDiscounts = discounts
    .filter((discount) => {
      // Filter by search query
      const matchesSearch = 
        discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discount.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isDiscountActive(discount)) ||
        (statusFilter === 'inactive' && !isDiscountActive(discount));

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      if (sortField === 'code') {
        return sortDirection === 'asc'
          ? a.code.localeCompare(b.code)
          : b.code.localeCompare(a.code);
      }

      if (sortField === 'startDate') {
        return sortDirection === 'asc'
          ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }

      if (sortField === 'endDate') {
        return sortDirection === 'asc'
          ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      }

      return 0;
    });

  const handleSort = (field: 'code' | 'startDate' | 'endDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrder: 0,
    maxDiscount: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    usageLimit: 0,
    applicableProducts: 'all',
  });

  const handleAddDiscount = () => {
    setIsEditMode(false);
    setCurrentDiscount(null);
    
    // Set default dates (today and +30 days)
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    setFormData({
      id: '',
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrder: 0,
      maxDiscount: 0,
      startDate: today.toISOString().split('T')[0],
      endDate: thirtyDaysLater.toISOString().split('T')[0],
      isActive: true,
      usageLimit: 0,
      applicableProducts: 'all',
    });
    
    setIsShowingForm(true);
  };

  const handleEditDiscount = (discount: Discount) => {
    setIsEditMode(true);
    setCurrentDiscount(discount);
    
    // Format dates for input[type="date"]
    const startDate = new Date(discount.startDate);
    const endDate = new Date(discount.endDate);
    
    setFormData({
      id: discount.id,
      code: discount.code,
      description: discount.description,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      minOrder: discount.minOrder,
      maxDiscount: discount.maxDiscount || 0,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      isActive: discount.isActive,
      usageLimit: discount.usageLimit || 0,
      applicableProducts: discount.applicableProducts === 'all' ? 'all' : 'specific',
    });
    
    setIsShowingForm(true);
  };

  const handleDeleteDiscount = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus diskon ini?')) {
      setDiscounts(discounts.filter((discount) => discount.id !== id));
      toast.success('Diskon berhasil dihapus');
    }
  };

  const handleToggleStatus = (id: string) => {
    setDiscounts(
      discounts.map((discount) =>
        discount.id === id
          ? { ...discount, isActive: !discount.isActive }
          : discount
      )
    );
    
    const discount = discounts.find((d) => d.id === id);
    if (discount) {
      toast.success(
        `Diskon ${discount.code} ${
          discount.isActive ? 'dinonaktifkan' : 'diaktifkan'
        }`
      );
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? parseFloat(value)
        : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.error('Kode promo harus diisi');
      return false;
    }

    if (!formData.description.trim()) {
      toast.error('Deskripsi harus diisi');
      return false;
    }

    if (formData.discountValue <= 0) {
      toast.error('Nilai diskon harus lebih dari 0');
      return false;
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      toast.error('Persentase diskon tidak boleh lebih dari 100%');
      return false;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error('Tanggal mulai dan berakhir harus diisi');
      return false;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error('Tanggal mulai tidak boleh setelah tanggal berakhir');
      return false;
    }

    // Check if code already exists (for new discounts only)
    if (!isEditMode && discounts.some(d => d.code === formData.code)) {
      toast.error('Kode promo sudah digunakan');
      return false;
    }

    return true;
  };

  const handleSubmitDiscount = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create start and end dates with time
    const startDate = new Date(formData.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(formData.endDate);
    endDate.setHours(23, 59, 59, 999);

    if (isEditMode && currentDiscount) {
      const updatedDiscount: Discount = {
        ...currentDiscount,
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType as 'percentage' | 'fixed',
        discountValue: formData.discountValue,
        minOrder: formData.minOrder,
        maxDiscount: formData.discountType === 'percentage' && formData.maxDiscount > 0 
          ? formData.maxDiscount 
          : undefined,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive: formData.isActive,
        usageLimit: formData.usageLimit > 0 ? formData.usageLimit : undefined,
        applicableProducts: formData.applicableProducts as 'all' | string[],
      };

      setDiscounts(
        discounts.map((discount) =>
          discount.id === updatedDiscount.id ? updatedDiscount : discount
        )
      );
      toast.success(`Diskon ${updatedDiscount.code} berhasil diperbarui`);
    } else {
      const newDiscount: Discount = {
        id: Date.now().toString(),
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType as 'percentage' | 'fixed',
        discountValue: formData.discountValue,
        minOrder: formData.minOrder,
        maxDiscount: formData.discountType === 'percentage' && formData.maxDiscount > 0 
          ? formData.maxDiscount 
          : undefined,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive: formData.isActive,
        usageLimit: formData.usageLimit > 0 ? formData.usageLimit : undefined,
        usageCount: 0,
        applicableProducts: formData.applicableProducts as 'all' | string[],
      };

      setDiscounts([...discounts, newDiscount]);
      toast.success(`Diskon ${newDiscount.code} berhasil ditambahkan`);
    }

    setIsShowingForm(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Diskon</h1>
          <p className="text-secondary-600">
            Kelola kode diskon dan promo untuk pelanggan kantin.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={handleAddDiscount}
            className="flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Diskon
          </Button>
        </div>
      </div>

      {isShowingForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Diskon' : 'Tambah Diskon Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitDiscount} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Kode Promo"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  placeholder="DISKON10"
                  required
                />

                <Input
                  label="Deskripsi"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Deskripsi diskon"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-secondary-700 font-medium mb-1">
                    Tipe Diskon
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                  </select>
                </div>

                <Input
                  label={formData.discountType === 'percentage' ? "Nilai Diskon (%)" : "Nilai Diskon (Rp)"}
                  name="discountValue"
                  type="number"
                  value={formData.discountValue.toString()}
                  onChange={handleFormChange}
                  placeholder={formData.discountType === 'percentage' ? "10" : "10000"}
                  required
                />

                <Input
                  label="Minimum Pembelian (Rp)"
                  name="minOrder"
                  type="number"
                  value={formData.minOrder.toString()}
                  onChange={handleFormChange}
                  placeholder="0"
                />
              </div>

              {formData.discountType === 'percentage' && (
                <div className="mb-4">
                  <Input
                    label="Maksimum Diskon (Rp)"
                    name="maxDiscount"
                    type="number"
                    value={formData.maxDiscount.toString()}
                    onChange={handleFormChange}
                    placeholder="Kosongkan jika tidak ada batas"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Tanggal Mulai"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleFormChange}
                  required
                />

                <Input
                  label="Tanggal Berakhir"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleFormChange}
                  required
                />

                <Input
                  label="Batas Penggunaan (0 = Tidak Terbatas)"
                  name="usageLimit"
                  type="number"
                  value={formData.usageLimit.toString()}
                  onChange={handleFormChange}
                  placeholder="0"
                />
              </div>

              <div className="mb-4">
                <label className="block text-secondary-700 font-medium mb-1">
                  Berlaku Untuk Produk
                </label>
                <select
                  name="applicableProducts"
                  value={formData.applicableProducts}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="all">Semua Produk</option>
                  <option value="specific">Produk Tertentu (Diedit di Menu Produk)</option>
                </select>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-secondary-700"
                >
                  Diskon Aktif
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">
                  {isEditMode ? 'Perbarui Diskon' : 'Tambah Diskon'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsShowingForm(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Diskon</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari kode promo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>

            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                disabled={!searchQuery && statusFilter === 'all'}
              >
                Reset Filter
              </Button>
            </div>
          </div>

          {/* Discounts Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                <tr>
                  <th
                    className="px-4 py-3 rounded-tl-lg cursor-pointer"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center">
                      Kode Promo
                      {sortField === 'code' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3">Nilai Diskon</th>
                  <th className="px-4 py-3">Min. Pembelian</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort('startDate')}
                  >
                    <div className="flex items-center">
                      Mulai
                      {sortField === 'startDate' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort('endDate')}
                  >
                    <div className="flex items-center">
                      Berakhir
                      {sortField === 'endDate' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3">Penggunaan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiscounts.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <FaFilter className="text-secondary-300 mb-2 h-10 w-10" />
                        <p className="text-secondary-600 font-medium">
                          Tidak ada diskon yang ditemukan
                        </p>
                        <p className="text-secondary-500 text-sm mt-1">
                          Coba ubah filter atau tambahkan diskon baru
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDiscounts.map((discount) => {
                    const status = getDiscountStatus(discount);
                    
                    return (
                      <tr
                        key={discount.id}
                        className="border-b border-secondary-200 hover:bg-secondary-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="bg-primary-100 rounded-full p-1.5 text-primary-600 mr-2">
                              <FaTag size={14} />
                            </div>
                            <span className="font-medium text-secondary-900">
                              {discount.code}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="line-clamp-2 text-secondary-600">
                            {discount.description}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {discount.discountType === 'percentage' ? (
                            <div className="flex items-center">
                              <FaPercent className="mr-1 text-secondary-500" size={12} />
                              <span className="font-medium">{discount.discountValue}%</span>
                              {discount.maxDiscount && (
                                <span className="text-xs text-secondary-500 ml-1">
                                  (Maks. {formatCurrency(discount.maxDiscount)})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="font-medium">
                              {formatCurrency(discount.discountValue)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {discount.minOrder > 0
                            ? formatCurrency(discount.minOrder)
                            : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-secondary-400 mr-2" size={14} />
                            <span>{formatDate(discount.startDate)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-secondary-400 mr-2" size={14} />
                            <span>{formatDate(discount.endDate)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <FaClock className="text-secondary-400 mr-2" size={14} />
                            <span>
                              {discount.usageCount}{' '}
                              {discount.usageLimit
                                ? `/ ${discount.usageLimit}`
                                : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.text}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(discount.id)}
                              className={`p-1.5 ${
                                discount.isActive
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-green-600 hover:bg-green-50'
                              } rounded-md transition-colors`}
                              title={discount.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                            >
                              {discount.isActive ? <FaTimes /> : <FaCheck />}
                            </button>
                            <button
                              onClick={() => handleEditDiscount(discount)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteDiscount(discount.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDiscountsPage;