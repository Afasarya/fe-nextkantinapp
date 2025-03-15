'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FaShoppingBag,
  FaUtensils,
  FaUsers,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaCheck,
  FaHourglassHalf,
  FaTimesCircle,
  FaExclamationTriangle,
  FaCalendarAlt,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent,  } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Stats data
  const statsData = {
    totalOrders: 47,
    totalRevenue: 980000,
    totalCustomers: 35,
    totalProducts: 42,
    dailyChange: {
      orders: 12,
      revenue: 15,
      customers: 8,
      products: 0,
    },
  };

  // Recent orders
  const recentOrders = [
    {
      id: '1',
      orderNumber: 'ORD-20240315-001',
      date: '2024-03-15T10:30:00Z',
      customer: 'Budi Santoso',
      total: 55000,
      status: 'processing',
    },
    {
      id: '2',
      orderNumber: 'ORD-20240315-002',
      date: '2024-03-15T11:45:00Z',
      customer: 'Siti Rahayu',
      total: 38000,
      status: 'pending',
    },
    {
      id: '3',
      orderNumber: 'ORD-20240315-003',
      date: '2024-03-15T12:15:00Z',
      customer: 'Ahmad Fadli',
      total: 42000,
      status: 'ready',
    },
    {
      id: '4',
      orderNumber: 'ORD-20240315-004',
      date: '2024-03-15T13:20:00Z',
      customer: 'Maya Wijaya',
      total: 27000,
      status: 'completed',
    },
  ];

  // Popular products
  const popularProducts = [
    {
      id: '1',
      name: 'Nasi Goreng Spesial',
      category: 'Makanan Utama',
      price: 15000,
      sold: 145,
    },
    {
      id: '2',
      name: 'Mie Ayam Bakso',
      category: 'Makanan Utama',
      price: 12000,
      sold: 120,
    },
    {
      id: '3',
      name: 'Es Teh Manis',
      category: 'Minuman',
      price: 5000,
      sold: 200,
    },
    {
      id: '4',
      name: 'Ayam Penyet',
      category: 'Makanan Utama',
      price: 18000,
      sold: 110,
    },
    {
      id: '5',
      name: 'Bakso Sapi',
      category: 'Makanan Utama',
      price: 14000,
      sold: 95,
    },
  ];

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

  // Status badges
  const getStatusBadge = (status: string) => {
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
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-secondary-600">
          Selamat datang kembali, Admin! Berikut adalah ringkasan data kantin Anda hari ini.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setTimeRange('daily')}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              timeRange === 'daily'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-700 hover:bg-secondary-50'
            } border border-secondary-300`}
          >
            Harian
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('weekly')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'weekly'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-700 hover:bg-secondary-50'
            } border-t border-b border-secondary-300`}
          >
            Mingguan
          </button>
          <button
            type="button"
            onClick={() => setTimeRange('monthly')}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              timeRange === 'monthly'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-700 hover:bg-secondary-50'
            } border border-secondary-300`}
          >
            Bulanan
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Orders */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Pesanan</p>
                <h3 className="text-2xl font-bold mt-1">{statsData.totalOrders}</h3>
                <div className="flex items-center mt-1">
                  {statsData.dailyChange.orders >= 0 ? (
                    <span className="text-green-600 flex items-center text-sm">
                      <FaArrowUp className="mr-1" />
                      {statsData.dailyChange.orders}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center text-sm">
                      <FaArrowDown className="mr-1" />
                      {Math.abs(statsData.dailyChange.orders)}%
                    </span>
                  )}
                  <span className="text-secondary-500 text-sm ml-2">dari kemarin</span>
                </div>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <FaShoppingBag className="text-primary-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Pendapatan</p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(statsData.totalRevenue)}</h3>
                <div className="flex items-center mt-1">
                  {statsData.dailyChange.revenue >= 0 ? (
                    <span className="text-green-600 flex items-center text-sm">
                      <FaArrowUp className="mr-1" />
                      {statsData.dailyChange.revenue}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center text-sm">
                      <FaArrowDown className="mr-1" />
                      {Math.abs(statsData.dailyChange.revenue)}%
                    </span>
                  )}
                  <span className="text-secondary-500 text-sm ml-2">dari kemarin</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Pelanggan</p>
                <h3 className="text-2xl font-bold mt-1">{statsData.totalCustomers}</h3>
                <div className="flex items-center mt-1">
                  {statsData.dailyChange.customers >= 0 ? (
                    <span className="text-green-600 flex items-center text-sm">
                      <FaArrowUp className="mr-1" />
                      {statsData.dailyChange.customers}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center text-sm">
                      <FaArrowDown className="mr-1" />
                      {Math.abs(statsData.dailyChange.customers)}%
                    </span>
                  )}
                  <span className="text-secondary-500 text-sm ml-2">dari kemarin</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-secondary-600">Total Produk</p>
                <h3 className="text-2xl font-bold mt-1">{statsData.totalProducts}</h3>
                <div className="flex items-center mt-1">
                  {statsData.dailyChange.products >= 0 ? (
                    <span className="text-green-600 flex items-center text-sm">
                      <FaArrowUp className="mr-1" />
                      {statsData.dailyChange.products}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center text-sm">
                      <FaArrowDown className="mr-1" />
                      {Math.abs(statsData.dailyChange.products)}%
                    </span>
                  )}
                  <span className="text-secondary-500 text-sm ml-2">dari kemarin</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaUtensils className="text-yellow-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaChartLine className="mr-2 text-primary-600" />
              <span>Pendapatan {timeRange === 'daily' ? 'Harian' : timeRange === 'weekly' ? 'Mingguan' : 'Bulanan'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 bg-secondary-50 rounded-md flex items-center justify-center">
              <div className="text-center">
                <FaChartLine className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">Grafik pendapatan akan muncul di sini.</p>
                <p className="text-secondary-500 text-sm">Pada implementasi nyata, gunakan Chart.js atau library grafik lainnya.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaChartBar className="mr-2 text-primary-600" />
              <span>Pesanan {timeRange === 'daily' ? 'Harian' : timeRange === 'weekly' ? 'Mingguan' : 'Bulanan'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 bg-secondary-50 rounded-md flex items-center justify-center">
              <div className="text-center">
                <FaChartBar className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
                <p className="text-secondary-600">Grafik pesanan akan muncul di sini.</p>
                <p className="text-secondary-500 text-sm">Pada implementasi nyata, gunakan Chart.js atau library grafik lainnya.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <FaShoppingBag className="mr-2 text-primary-600" />
              <span>Pesanan Terbaru</span>
            </CardTitle>
            <Link href="/admin/orders">
              <Button variant="secondary" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-secondary-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/admin/orders/${order.id}`} className="font-medium hover:text-primary-600 transition-colors">
                        {order.orderNumber}
                      </Link>
                      <div className="flex items-center mt-1 text-sm text-secondary-500">
                        <FaCalendarAlt className="mr-1" />
                        <span>{formatDate(order.date)}</span>
                      </div>
                      <div className="mt-1 text-sm">{order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary-600">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <FaUtensils className="mr-2 text-primary-600" />
              <span>Produk Populer</span>
            </CardTitle>
            <Link href="/admin/products">
              <Button variant="secondary" size="sm">
                Lihat Semua
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-secondary-200">
              {popularProducts.map((product) => (
                <div key={product.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/admin/products/${product.id}`} className="font-medium hover:text-primary-600 transition-colors">
                        {product.name}
                      </Link>
                      <div className="mt-1 text-sm text-secondary-500">
                        {product.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-primary-600">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="mt-1 text-sm text-secondary-500">
                        Terjual: {product.sold}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FaChartPie className="mr-2 text-primary-600" />
            <span>Distribusi Kategori Produk</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-secondary-50 rounded-md flex items-center justify-center">
            <div className="text-center">
              <FaChartPie className="w-12 h-12 text-secondary-300 mx-auto mb-4" />
              <p className="text-secondary-600">Grafik distribusi kategori akan muncul di sini.</p>
              <p className="text-secondary-500 text-sm">Pada implementasi nyata, gunakan Chart.js atau library grafik lainnya.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;