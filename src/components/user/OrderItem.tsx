"use client";

import React from 'react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

type OrderStatus = 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';

interface OrderItemProps {
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

const OrderItem: React.FC<OrderItemProps> = ({
  id,
  orderNumber,
  date,
  items,
  total,
  status,
}) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusText = {
    pending: 'Menunggu Konfirmasi',
    processing: 'Sedang Diproses',
    ready: 'Siap Diambil',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const formatItemList = () => {
    if (items.length === 0) return '';
    
    if (items.length === 1) {
      return `${items[0].quantity}x ${items[0].name}`;
    }
    
    return `${items[0].quantity}x ${items[0].name} & ${itemCount - items[0].quantity} item lainnya`;
  };

  return (
    <div className="border border-secondary-200 rounded-lg overflow-hidden">
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-secondary-600">{formatDate(date)}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {statusText[status]}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="font-medium">Order #{orderNumber}</p>
          <p className="font-bold text-primary-600">{formatCurrency(total)}</p>
        </div>
        
        <p className="text-sm text-secondary-600 mt-1 line-clamp-1">
          {formatItemList()}
        </p>
      </div>
      
      <div className="bg-secondary-50 p-3 border-t border-secondary-200 flex justify-between items-center">
        <Link href={`/orders/${id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
          Lihat Detail
        </Link>
        
        {(status === 'ready' || status === 'completed') && (
          <button className="text-sm px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            Cetak Bukti
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItem;