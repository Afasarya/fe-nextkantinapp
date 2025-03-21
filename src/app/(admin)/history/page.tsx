'use client';

import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaCalendarAlt,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { orderService } from '@/services/order';
import { Order } from '@/types/order';

const ORDER_STATUS = {
  'pending': 'Menunggu',
  'order': 'Diproses',
  'success': 'Sukses'
} as const;

const STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'processing': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
  'success': 'bg-green-100 text-green-800',
} as const;

const AdminHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    fetchOrders();
  }, [selectedMonth, selectedYear]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getAll(selectedMonth, selectedYear);
      setOrders(data);
    } catch (error) {
      toast.error('Gagal mengambil data riwayat pesanan');
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      await orderService.update(orderId, { status: newStatus });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success('Status pesanan berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui status pesanan');
      console.error('Error updating order status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
        <p className="text-secondary-600">
          Kelola dan pantau riwayat pesanan kantin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-secondary-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-secondary-300 rounded-md"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2000, i, 1).toLocaleString('id-ID', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-secondary-300 rounded-md"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
              <Input
                placeholder="Cari pesanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-secondary-600">Memuat data pesanan...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Pelanggan</th>
                    <th className="px-4 py-3">Menu</th>
                    <th className="px-4 py-3">Stand</th>
                    <th className="px-4 py-3">Jumlah</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center">
                        <p className="text-secondary-600">Tidak ada data pesanan</p>
                      </td>
                    </tr>
                  ) : (
                    orders
                      .filter(order => 
                        order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.food.name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((order) => (
                        <tr key={order.id} className="border-b border-secondary-200 hover:bg-secondary-50">
                          <td className="px-4 py-3">{formatDate(order.created_at)}</td>
                          <td className="px-4 py-3">{order.user.name}</td>
                          <td className="px-4 py-3">{order.food.name}</td>
                          <td className="px-4 py-3">{order.food.stand?.name || '-'}</td>
                          <td className="px-4 py-3">{order.quantity}</td>
                          <td className="px-4 py-3">{formatCurrency(order.total_price)}</td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                              className={`px-2 py-1 rounded text-sm ${STATUS_COLORS[order.status]}`}
                            >
                              {Object.entries(ORDER_STATUS).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHistoryPage;
