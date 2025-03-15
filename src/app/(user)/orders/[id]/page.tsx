'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/lib/utils';
import { FaArrowLeft, FaReceipt, FaPrint, FaClipboardCheck, FaTimes } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import toast from 'react-hot-toast';

// Define order status type
type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

// Sample order data
const orderData = {
  id: '123456',
  orderNumber: 'ORD-20240315-001',
  status: 'processing' as OrderStatus,
  date: '2024-03-15T10:30:00Z',
  items: [
    {
      id: '1',
      name: 'Nasi Goreng Spesial',
      price: 15000,
      quantity: 2,
      imageUrl: '/images/food-items/item1.jpg',
      notes: 'Pedas level 2, tambah telur',
    },
    {
      id: '2',
      name: 'Es Teh Manis',
      price: 5000,
      quantity: 2,
      imageUrl: '/images/food-items/item3.jpg',
      notes: '',
    },
    {
      id: '3',
      name: 'Ayam Penyet',
      price: 18000,
      quantity: 1,
      imageUrl: '/images/food-items/item4.jpg',
      notes: 'Sambal terpisah',
    },
  ],
  subtotal: 58000,
  serviceFee: 2000,
  discount: 5000,
  total: 55000,
  paymentMethod: 'cash',
  pickupTime: '10:45',
  customer: {
    name: 'Budi Santoso',
    phone: '081234567890',
  },
};

const OrderDetailPage = () => {
  const router = useRouter();
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  
  const handlePrintReceipt = () => {
    // In a real app, this would generate a receipt
    toast.success('Mencetak bukti pesanan...');
  };
  
  const handleCancelOrder = () => {
    setIsLoadingCancel(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Pesanan dibatalkan');
      router.push('/orders');
      setIsLoadingCancel(false);
    }, 1000);
  };
  
  const StatusIndicator = () => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const statusText = {
      pending: 'Menunggu Konfirmasi',
      processing: 'Sedang Diproses',
      ready: 'Siap Diambil',
      completed: 'Selesai',
      cancelled: 'Dibatalkan',
    };
    
    const StatusIcon = {
      pending: <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse" />,
      processing: <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse" />,
      ready: <FaClipboardCheck className="text-green-500" />,
      completed: <FaClipboardCheck className="text-green-500" />,
      cancelled: <FaTimes className="text-red-500" />,
    };
    
    return (
      <div className={`flex items-center px-4 py-2 rounded-full ${statusStyles[orderData.status]} border`}>
        <span className="mr-2">{StatusIcon[orderData.status]}</span>
        <span className="font-medium">{statusText[orderData.status]}</span>
      </div>
    );
  };
  
  return (
    <main className="min-h-screen bg-secondary-50">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-6">
          <Link href="/orders" className="flex items-center text-primary-600 font-medium">
            <FaArrowLeft className="mr-2" />
            Kembali ke Daftar Pesanan
          </Link>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Detail Pesanan #{orderData.orderNumber}</h1>
            <p className="text-secondary-600 mt-1">
              {formatDate(orderData.date)}
            </p>
          </div>
          
          <StatusIndicator />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FaReceipt className="mr-2 text-primary-600" />
                  <span>Detail Pesanan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-secondary-200">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        
                        <div className="ml-4 flex-grow">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-secondary-800">{item.name}</h3>
                              <p className="text-sm text-secondary-600 mt-1">
                                {formatCurrency(item.price)} x {item.quantity}
                              </p>
                              {item.notes && (
                                <p className="text-sm text-secondary-500 mt-1 italic">
                                  Catatan: {item.notes}
                                </p>
                              )}
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Customer Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Informasi Pemesan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm text-secondary-500 mb-1">Nama</h3>
                    <p className="font-medium">{orderData.customer.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary-500 mb-1">No. Telepon</h3>
                    <p className="font-medium">{orderData.customer.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary-500 mb-1">Waktu Pengambilan</h3>
                    <p className="font-medium">{orderData.pickupTime}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-secondary-500 mb-1">Metode Pembayaran</h3>
                    <p className="font-medium capitalize">
                      {orderData.paymentMethod === 'cash' ? 'Tunai' : 'Kartu'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Biaya Layanan</span>
                  <span className="font-medium">{formatCurrency(orderData.serviceFee)}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon</span>
                    <span className="font-medium">-{formatCurrency(orderData.discount)}</span>
                  </div>
                )}
                <div className="border-t border-secondary-200 pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary-600 text-lg">
                    {formatCurrency(orderData.total)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                {(orderData.status === 'ready' || orderData.status === 'completed') && (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handlePrintReceipt}
                    className="flex items-center justify-center"
                  >
                    <FaPrint className="mr-2" />
                    Cetak Bukti Pesanan
                  </Button>
                )}
                
                {orderData.status === 'pending' && (
                  <Button
                    variant="danger"
                    fullWidth
                    onClick={handleCancelOrder}
                    isLoading={isLoadingCancel}
                  >
                    Batalkan Pesanan
                  </Button>
                )}
                
                <Link href="/orders" className="w-full">
                  <Button variant="secondary" fullWidth>
                    Kembali ke Daftar Pesanan
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            {/* Order Timeline */}
            {orderData.status !== 'cancelled' && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Status Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="mr-3 flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs">
                          1
                        </div>
                        <div className="w-0.5 h-full bg-primary-600 mt-1"></div>
                      </div>
                      <div>
                        <h3 className="font-medium">Pesanan Dibuat</h3>
                        <p className="text-sm text-secondary-500 mt-1">
                          {formatDate(orderData.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          orderData.status !== 'pending' 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-secondary-200 text-secondary-700'
                        }`}>
                          2
                        </div>
                        <div className={`w-0.5 h-full mt-1 ${
                          orderData.status !== 'pending' 
                            ? 'bg-primary-600' 
                            : 'bg-secondary-200'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          orderData.status === 'pending' ? 'text-secondary-400' : ''
                        }`}>
                          Pesanan Diproses
                        </h3>
                        {orderData.status !== 'pending' && (
                          <p className="text-sm text-secondary-500 mt-1">
                            Estimasi selesai: 15 menit
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          orderData.status === 'ready' || orderData.status === 'completed'
                            ? 'bg-primary-600 text-white' 
                            : 'bg-secondary-200 text-secondary-700'
                        }`}>
                          3
                        </div>
                        <div className={`w-0.5 h-full mt-1 ${
                          orderData.status === 'ready' || orderData.status === 'completed'
                            ? 'bg-primary-600' 
                            : 'bg-secondary-200'
                        }`}></div>
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          orderData.status === 'pending' || orderData.status === 'processing' 
                            ? 'text-secondary-400' 
                            : ''
                        }`}>
                          Siap Diambil
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-3 flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          orderData.status === 'completed'
                            ? 'bg-primary-600 text-white' 
                            : 'bg-secondary-200 text-secondary-700'
                        }`}>
                          4
                        </div>
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          orderData.status !== 'completed' ? 'text-secondary-400' : ''
                        }`}>
                          Pesanan Selesai
                        </h3>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default OrderDetailPage;