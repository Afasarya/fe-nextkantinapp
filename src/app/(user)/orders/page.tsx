'use client';

import React, { useState } from 'react';
import { FaSearch, FaReceipt } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OrderItem from '@/components/user/OrderItem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
}

// Sample orders data
const sampleOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-20240315-001',
    date: '2024-03-15T10:30:00Z',
    items: [
      { name: 'Nasi Goreng Spesial', quantity: 2, price: 15000 },
      { name: 'Es Teh Manis', quantity: 2, price: 5000 },
      { name: 'Ayam Penyet', quantity: 1, price: 18000 },
    ],
    total: 55000,
    status: 'processing',
  },
  {
    id: '2',
    orderNumber: 'ORD-20240314-005',
    date: '2024-03-14T12:15:00Z',
    items: [
      { name: 'Mie Ayam Bakso', quantity: 1, price: 12000 },
      { name: 'Es Jeruk', quantity: 1, price: 6000 },
    ],
    total: 18000,
    status: 'completed',
  },
  {
    id: '3',
    orderNumber: 'ORD-20240313-010',
    date: '2024-03-13T09:45:00Z',
    items: [
      { name: 'Bakso Sapi', quantity: 1, price: 14000 },
      { name: 'Es Teh Manis', quantity: 1, price: 5000 },
    ],
    total: 19000,
    status: 'completed',
  },
  {
    id: '4',
    orderNumber: 'ORD-20240310-003',
    date: '2024-03-10T13:20:00Z',
    items: [
      { name: 'Soto Ayam', quantity: 2, price: 13000 },
      { name: 'Es Jeruk', quantity: 2, price: 6000 },
    ],
    total: 38000,
    status: 'completed',
  },
  {
    id: '5',
    orderNumber: 'ORD-20240308-007',
    date: '2024-03-08T11:30:00Z',
    items: [
      { name: 'Nasi Goreng Spesial', quantity: 1, price: 15000 },
      { name: 'Ayam Penyet', quantity: 1, price: 18000 },
    ],
    total: 33000,
    status: 'cancelled',
  },
];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders based on active tab and search query
  const filteredOrders = sampleOrders.filter((order) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' &&
        (order.status === 'pending' || order.status === 'processing' || order.status === 'ready')) ||
      (activeTab === 'completed' &&
        (order.status === 'completed' || order.status === 'cancelled'));

    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-secondary-50">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Pesanan Saya</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-secondary-200">
            <div className="flex">
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'active'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
                onClick={() => setActiveTab('active')}
              >
                Pesanan Aktif
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'completed'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
                onClick={() => setActiveTab('completed')}
              >
                Riwayat Pesanan
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'all'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-secondary-600 hover:text-primary-600'
                }`}
                onClick={() => setActiveTab('all')}
              >
                Semua Pesanan
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nomor pesanan..."
                className="w-full p-2 pl-10 border border-secondary-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <FaSearch className="absolute left-3 top-3 text-secondary-400" />
            </div>

            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <OrderItem
                    key={order.id}
                    id={order.id}
                    orderNumber={order.orderNumber}
                    date={order.date}
                    items={order.items}
                    total={order.total}
                    status={order.status}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <FaReceipt size={48} className="text-secondary-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Tidak ada pesanan</h2>
                <p className="text-secondary-600 mb-6">
                  {searchQuery
                    ? 'Tidak ada pesanan yang cocok dengan pencarian Anda.'
                    : activeTab === 'active'
                    ? 'Anda belum memiliki pesanan aktif saat ini.'
                    : activeTab === 'completed'
                    ? 'Anda belum memiliki riwayat pesanan.'
                    : 'Anda belum melakukan pemesanan.'}
                </p>
                <Button variant="primary" onClick={() => setSearchQuery('')}>
                  {searchQuery ? 'Reset Pencarian' : 'Pesan Sekarang'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Order Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Pesanan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary-600">{sampleOrders.length}</p>
              <p className="text-sm text-secondary-600 mt-1">Pesanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pesanan Selesai</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                {sampleOrders.filter((order) => order.status === 'completed').length}
              </p>
              <p className="text-sm text-secondary-600 mt-1">Pesanan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pesanan Dibatalkan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {sampleOrders.filter((order) => order.status === 'cancelled').length}
              </p>
              <p className="text-sm text-secondary-600 mt-1">Pesanan</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default OrdersPage;