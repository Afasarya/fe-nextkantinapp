'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaTrash,
  FaUserPlus,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

// Customer type
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: 'active' | 'inactive';
}

// Sample customers data
const customersData: Customer[] = [
  {
    id: '101',
    name: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    phone: '081234567890',
    registeredAt: '2023-10-15T08:30:00Z',
    orderCount: 15,
    totalSpent: 750000,
    lastOrderDate: '2024-03-15T10:30:00Z',
    status: 'active',
  },
  {
    id: '102',
    name: 'Siti Rahayu',
    email: 'siti.rahayu@example.com',
    phone: '089876543210',
    registeredAt: '2023-11-20T14:15:00Z',
    orderCount: 8,
    totalSpent: 320000,
    lastOrderDate: '2024-03-15T11:45:00Z',
    status: 'active',
  },
  {
    id: '103',
    name: 'Ahmad Fadli',
    email: 'ahmad.fadli@example.com',
    phone: '081122334455',
    registeredAt: '2023-12-05T09:45:00Z',
    orderCount: 12,
    totalSpent: 550000,
    lastOrderDate: '2024-03-15T12:15:00Z',
    status: 'active',
  },
  {
    id: '104',
    name: 'Maya Wijaya',
    email: 'maya.wijaya@example.com',
    phone: '087712345678',
    registeredAt: '2024-01-10T16:20:00Z',
    orderCount: 5,
    totalSpent: 200000,
    lastOrderDate: '2024-03-15T13:20:00Z',
    status: 'active',
  },
  {
    id: '105',
    name: 'Dimas Prayogo',
    email: 'dimas.prayogo@example.com',
    phone: '082233445566',
    registeredAt: '2024-01-25T11:10:00Z',
    orderCount: 3,
    totalSpent: 120000,
    lastOrderDate: '2024-03-14T09:30:00Z',
    status: 'active',
  },
  {
    id: '106',
    name: 'Rini Susanti',
    email: 'rini.susanti@example.com',
    phone: '089988776655',
    registeredAt: '2024-02-08T13:45:00Z',
    orderCount: 2,
    totalSpent: 80000,
    lastOrderDate: '2024-03-12T15:20:00Z',
    status: 'active',
  },
  {
    id: '107',
    name: 'Hadi Nugroho',
    email: 'hadi.nugroho@example.com',
    phone: '081234123412',
    registeredAt: '2024-02-15T10:30:00Z',
    orderCount: 0,
    totalSpent: 0,
    status: 'inactive',
  },
];

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField] = useState<'name' | 'orderCount' | 'totalSpent' | 'registeredAt'>('registeredAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    status: 'active' as 'active' | 'inactive',
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      // Filter by search query
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      // Filter by status
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortField === 'orderCount') {
        return sortDirection === 'asc'
          ? a.orderCount - b.orderCount
          : b.orderCount - a.orderCount;
      }

      if (sortField === 'totalSpent') {
        return sortDirection === 'asc'
          ? a.totalSpent - b.totalSpent
          : b.totalSpent - a.totalSpent;
      }

      if (sortField === 'registeredAt') {
        return sortDirection === 'asc'
          ? new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime()
          : new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
      }

      return 0;
    });

  const handleSort = (field: 'name' | 'orderCount' | 'totalSpent' | 'registeredAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleAddCustomer = () => {
    setIsEditMode(false);
    setCurrentCustomer(null);
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      status: 'active',
    });
    setIsShowingForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setIsEditMode(true);
    setCurrentCustomer(customer);
    setFormData({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
    });
    setIsShowingForm(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      setCustomers(customers.filter((customer) => customer.id !== id));
      toast.success('Pelanggan berhasil dihapus');
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Nama harus diisi');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email harus diisi');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Format email tidak valid');
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error('Nomor telepon harus diisi');
      return false;
    }

    return true;
  };

  const handleSubmitCustomer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const now = new Date().toISOString();
    
    if (isEditMode && currentCustomer) {
      const updatedCustomer = {
        ...currentCustomer,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      };

      setCustomers(
        customers.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );
      toast.success(`Data pelanggan ${updatedCustomer.name} berhasil diperbarui`);
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        registeredAt: now,
        orderCount: 0,
        totalSpent: 0,
        status: formData.status,
      };

      setCustomers([...customers, newCustomer]);
      toast.success(`Pelanggan ${newCustomer.name} berhasil ditambahkan`);
    }

    setIsShowingForm(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Pelanggan</h1>
          <p className="text-secondary-600">
            Kelola data pelanggan kantin Anda.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={handleAddCustomer}
            className="flex items-center"
          >
            <FaUserPlus className="mr-2" /> Tambah Pelanggan
          </Button>
        </div>
      </div>

      {isShowingForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Lengkap"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nomor Telepon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />

                <div className="mb-4">
                  <label className="block text-secondary-700 font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">
                  {isEditMode ? 'Perbarui Pelanggan' : 'Tambah Pelanggan'}
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
          <CardTitle>Daftar Pelanggan</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari pelanggan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <FaSearch className="absolute left-3 top-3 text-secondary-400" />
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

          {/* Customers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Pelanggan</th>
                  <th className="px-4 py-3">Kontak</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort('registeredAt')}
                  >
                    <div className="flex items-center">
                      Tanggal Registrasi
                      {sortField === 'registeredAt' ? (
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
                    onClick={() => handleSort('orderCount')}
                  >
                    <div className="flex items-center">
                      Pesanan
                      {sortField === 'orderCount' ? (
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
                    onClick={() => handleSort('totalSpent')}
                  >
                    <div className="flex items-center">
                      Total Belanja
                      {sortField === 'totalSpent' ? (
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
                  <th className="px-4 py-3">Pesanan Terakhir</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <FaFilter className="text-secondary-300 mb-2 h-10 w-10" />
                        <p className="text-secondary-600 font-medium">
                          Tidak ada pelanggan yang ditemukan
                        </p>
                        <p className="text-secondary-500 text-sm mt-1">
                          Coba ubah filter atau tambahkan pelanggan baru
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-secondary-200 hover:bg-secondary-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-bold mr-3">
                            {getInitials(customer.name)}
                          </div>
                          <span className="font-medium text-secondary-900">
                            {customer.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <div className="flex items-center text-secondary-600">
                            <FaEnvelope className="mr-2 text-secondary-400" size={14} />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center text-secondary-600 mt-1">
                            <FaPhone className="mr-2 text-secondary-400" size={14} />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-secondary-600">
                          <FaCalendarAlt className="mr-2 text-secondary-400" size={14} />
                          <span>{formatDate(customer.registeredAt)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-center">
                        {customer.orderCount}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="px-4 py-3">
                        {customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            customer.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-secondary-100 text-secondary-800'
                          }`}
                        >
                          {customer.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditCustomer(customer)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          {customer.orderCount > 0 ? (
                            <Link href={`/admin/customers/${customer.id}`}>
                              <div className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-md transition-colors">
                                <FaEye />
                              </div>
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomersPage;