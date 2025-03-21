'use client';

import React, { useState, useEffect } from 'react';
import {
  FaShoppingBag,
  FaUtensils,
  FaUsers,
  FaMoneyBillWave,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent,  } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { dashboardService } from '@/services/dashboard';

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 47,
    totalRevenue: 980000,
    totalCustomers: 35,
    dailyChange: {
      orders: 12,
      revenue: 15,
      customers: 8,
      products: 0,
    },
  });

  // Fetch dashboard stats
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardService.getStats();
      setStats(prev => ({
        ...prev,
        totalProducts: data.total_foods,
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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
                <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
                <div className="flex items-center mt-1">
                  {stats.dailyChange.orders >= 0 ? (
                    <span className="text-green-600 flex items-center text-sm">
                      <FaArrowUp className="mr-1" />
                      {stats.dailyChange.orders}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center text-sm">
                      <FaArrowDown className="mr-1" />
                      {Math.abs(stats.dailyChange.orders)}%
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
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                <div className="flex items-center mt-1">
                  {stats.dailyChange.revenue >= 0 ? (
                    <span className="text-green-600 flex items-center text-sm">
                      <FaArrowUp className="mr-1" />
                      {stats.dailyChange.revenue}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center text-sm">
                      <FaArrowDown className="mr-1" />
                      {Math.abs(stats.dailyChange.revenue)}%
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
                <h3 className="text-2xl font-bold mt-1">{stats.totalCustomers}</h3>
                <div className="flex items-center mt-1">
                  {stats.dailyChange.customers >= 0 ? (
                    <span className="text-green-600 flex items-center text-sm">
                      <FaArrowUp className="mr-1" />
                      {stats.dailyChange.customers}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center text-sm">
                      <FaArrowDown className="mr-1" />
                      {Math.abs(stats.dailyChange.customers)}%
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
                {isLoading ? (
                  <div className="animate-pulse h-8 w-16 bg-secondary-200 rounded mt-1"></div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mt-1">{stats.totalProducts}</h3>
                    <div className="flex items-center mt-1">
                      {stats.dailyChange.products >= 0 ? (
                        <span className="text-green-600 flex items-center text-sm">
                          <FaArrowUp className="mr-1" />
                          {stats.dailyChange.products}%
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center text-sm">
                          <FaArrowDown className="mr-1" />
                          {Math.abs(stats.dailyChange.products)}%
                        </span>
                      )}
                      <span className="text-secondary-500 text-sm ml-2">dari kemarin</span>
                    </div>
                  </>
                )}
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaUtensils className="text-yellow-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default DashboardPage;