'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaCalendarAlt,
  FaCheck,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaTimesCircle,
  FaUser,
  FaEye,
  FaPrint,
  FaChevronDown,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

// Order type
type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }[];
  subtotal: number;
  serviceFee: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  status: OrderStatus;
}

// Sample orders data
const ordersData: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-20240315-001',
    date: '2024-03-15T10:30:00Z',
    customer: {
      id: '101',
      name: 'Budi Santoso',
      phone: '081234567890',
    },
    items: [
      {
        id: '1',
        name: 'Nasi Goreng Spesial',
        price: 15000,
        quantity: 2,
        notes: 'Pedas level 2, tambah telur',
      },
      {
        id: '2',
        name: 'Es Teh Manis',
        price: 5000,
        quantity: 2,
      },
      {
        id: '3',
        name: 'Ayam Penyet',
        price: 18000,
        quantity: 1,
        notes: 'Sambal terpisah',
      },
    ],
    subtotal: 58000,
    serviceFee: 2000,
    discount: 5000,
    total: 55000,
    paymentMethod: 'cash',
    status: 'processing',
  },
  {
    id: '2',
    orderNumber: 'ORD-20240315-002',
    date: '2024-03-15T11:45:00Z',
    customer: {
      id: '102',
      name: 'Siti Rahayu',
      phone: '089876543210',
    },
    items: [
      {
        id: '4',
        name: 'Mie Ayam Bakso',
        price: 12000,
        quantity: 1,
      },
      {
        id: '5',
        name: 'Es Jeruk',
        price: 6000,
        quantity: 1,
      },
    ],
    subtotal: 18000,
    serviceFee: 2000,
    discount: 0,
    total: 20000,
    paymentMethod: 'cash',
    status: 'pending',
  },
  {
    id: '3',
    orderNumber: 'ORD-20240315-003',
    date: '2024-03-15T12:15:00Z',
    customer: {
      id: '103',
      name: 'Ahmad Fadli',
      phone: '081122334455',
    },
    items: [
      {
        id: '6',
        name: 'Bakso Sapi',
        price: 14000,
        quantity: 2,
        notes: 'Tambah sambal',
      },
      {
        id: '7',
        name: 'Es Teh Manis',
        price: 5000,
        quantity: 2,
      },
    ],
    subtotal: 38000,
    serviceFee: 2000,
    discount: 0,
    total: 40000,
    paymentMethod: 'card',
    status: 'ready',
  },
  {
    id: '4',
    orderNumber: 'ORD-20240315-004',
    date: '2024-03-15T13:20:00Z',
    customer: {
      id: '104',
      name: 'Maya Wijaya',
      phone: '087712345678',
    },
    items: [
      {
        id: '8',
        name: 'Nasi Goreng Spesial',
        price: 15000,
        quantity: 1,
      },
      {
        id: '9',
        name: 'Es Jeruk',
        price: 6000,
        quantity: 2,
      },
    ],
    subtotal: 27000,
    serviceFee: 2000,
    discount: 0,
    total: 29000,
    paymentMethod: 'cash',
    status: 'completed',
  },
  {
    id: '5',
    orderNumber: 'ORD-20240314-001',
    date: '2024-03-14T09:30:00Z',
    customer: {
      id: '105',
      name: 'Dimas Prayogo',
      phone: '082233445566',
    },
    items: [
      {
        id: '10',
        name: 'Ayam Penyet',
        price: 18000,
        quantity: 1,
      },
      {
        id: '11',
        name: 'Soto Ayam',
        price: 13000,
        quantity: 1,
      },
      {
        id: '12',
        name: 'Es Teh Manis',
        price: 5000,
        quantity: 2,
      },
    ],
    subtotal: 41000,
    serviceFee: 2000,
    discount: 0,
    total: 43000,
    paymentMethod: 'cash',
    status: 'cancelled',
  },
];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState<'date' | 'total' | null>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // New state for dropdown open status by order ID
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});
  
  // Toggle dropdown visibility
  const toggleDropdown = (orderId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Close all dropdowns when clicking outside
  const closeAllDropdowns = () => {
    setOpenDropdowns({});
  };

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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get date for filtering
  const getFilterDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Filter by search query (order number or customer name)
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery);

      // Filter by status
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      // Filter by date
      const matchesDate = dateFilter
        ? getFilterDate(order.date) === dateFilter
        : true;

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      if (sortField === 'total') {
        return sortDirection === 'asc'
          ? a.total - b.total
          : b.total - a.total;
      }

      return 0;
    });

  const handleSort = (field: 'date' | 'total') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle status update with direct status selection
  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    // Close the dropdown after selection
    setOpenDropdowns(prev => ({...prev, [id]: false}));
    toast.success('Status pesanan berhasil diperbarui');
  };

  // Status badges
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FaExclamationTriangle className="mr-1" /> Menunggu
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FaHourglassHalf className="mr-1" /> Diproses
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheck className="mr-1" /> Siap
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FaCheck className="mr-1" /> Selesai
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FaTimesCircle className="mr-1" /> Dibatalkan
          </span>
        );
      default:
        return null;
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return null;
    }
  };

  return (
    <div onClick={closeAllDropdowns}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
        <p className="text-secondary-600">
          Pantau dan kelola pesanan dari pelanggan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari nomor pesanan / pelanggan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <FaSearch className="absolute left-3 top-3 text-secondary-400" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="processing">Diproses</option>
                <option value="ready">Siap Diambil</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>

              <div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2"
                />
              </div>
            </div>

            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setDateFilter('');
                }}
                disabled={!searchQuery && statusFilter === 'all' && !dateFilter}
              >
                Reset Filter
              </Button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">No. Pesanan</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Tanggal
                      {sortField === 'date' ? (
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
                  <th className="px-4 py-3">Pelanggan</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort('total')}
                  >
                    <div className="flex items-center">
                      Total
                      {sortField === 'total' ? (
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
                  <th className="px-4 py-3">Pembayaran</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <FaFilter className="text-secondary-300 mb-2 h-10 w-10" />
                        <p className="text-secondary-600 font-medium">
                          Tidak ada pesanan yang ditemukan
                        </p>
                        <p className="text-secondary-500 text-sm mt-1">
                          Coba ubah filter pencarian Anda
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-secondary-200 hover:bg-secondary-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-secondary-900">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-secondary-400 mr-2" />
                          <span>{formatDate(order.date)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="bg-primary-100 rounded-full p-1.5 text-primary-600 mr-2">
                            <FaUser size={14} />
                          </div>
                          <div>
                            <div>{order.customer.name}</div>
                            <div className="text-xs text-secondary-500">
                              {order.customer.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                          {order.paymentMethod === 'cash' ? 'Tunai' : 'Kartu'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex items-center"
                            >
                              <FaEye className="mr-1" /> Detail
                            </Button>
                          </Link>

                          {(order.status === 'ready' || order.status === 'completed') && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex items-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success('Mencetak bukti pesanan...');
                              }}
                            >
                              <FaPrint className="mr-1" /> Cetak
                            </Button>
                          )}

                          {/* Status Update Dropdown */}
                          {(order.status as OrderStatus) !== 'cancelled' && (
                            <>
                              {getNextStatus(order.status) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateStatus(order.id, getNextStatus(order.status)!);
                                  }}
                                >
                                  Langkah Selanjutnya
                                </Button>
                              )}
                              <div className="relative">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  className="flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDropdown(order.id);
                                  }}
                                >
                                  Ubah Status <FaChevronDown className="ml-2" />
                                </Button>
                              
                              {openDropdowns[order.id] && (
                                <div 
                                  className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-secondary-200"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ul className="py-1">
                                    {/* Only show status options that are different from current */}
                                    {order.status !== 'pending' && (
                                      <li 
                                        className="px-4 py-2 hover:bg-secondary-100 cursor-pointer flex items-center"
                                        onClick={() => handleUpdateStatus(order.id, 'pending')}
                                      >
                                        <FaExclamationTriangle className="mr-2 text-yellow-600" />
                                        Menunggu
                                      </li>
                                    )}
                                    {order.status !== 'processing' && (
                                      <li 
                                        className="px-4 py-2 hover:bg-secondary-100 cursor-pointer flex items-center"
                                        onClick={() => handleUpdateStatus(order.id, 'processing')}
                                      >
                                        <FaHourglassHalf className="mr-2 text-blue-600" />
                                        Diproses
                                      </li>
                                    )}
                                    {order.status !== 'ready' && (
                                      <li 
                                        className="px-4 py-2 hover:bg-secondary-100 cursor-pointer flex items-center"
                                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                                      >
                                        <FaCheck className="mr-2 text-green-600" />
                                        Siap Diambil
                                      </li>
                                    )}
                                      {order.status !== 'completed' && (
                                        <li 
                                          className="px-4 py-2 hover:bg-secondary-100 cursor-pointer flex items-center"
                                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                                        >
                                          <FaCheck className="mr-2 text-green-600" />
                                          Selesai
                                        </li>
                                      )}
                                      {order.status !== 'cancelled' && (
                                        <li 
                                          className="px-4 py-2 hover:bg-secondary-100 cursor-pointer flex items-center text-red-600"
                                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                        >
                                          <FaTimesCircle className="mr-2" />
                                          Batalkan
                                        </li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                                </div>
                              </>
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

export default AdminOrdersPage;