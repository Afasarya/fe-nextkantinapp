"use client";

import React from 'react';
import Image from 'next/image';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  return (
    <div className="flex items-center py-4">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="rounded-md object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <h3 className="font-medium text-secondary-900">{name}</h3>
        <p className="text-primary-600 font-medium mt-1">
          {formatCurrency(price)}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onDecrement}
          className="p-1 text-secondary-600 hover:text-secondary-900 transition-colors"
          disabled={quantity <= 1}
        >
          <FaMinus size={14} />
        </button>
        <span className="w-8 text-center">{quantity}</span>
        <button
          onClick={onIncrement}
          className="p-1 text-secondary-600 hover:text-secondary-900 transition-colors"
        >
          <FaPlus size={14} />
        </button>
      </div>

      <div className="ml-6 text-right">
        <p className="font-medium text-secondary-900">
          {formatCurrency(price * quantity)}
        </p>
        <button
          onClick={onRemove}
          className="mt-1 text-red-600 hover:text-red-700 transition-colors flex items-center text-sm"
        >
          <FaTrash size={12} className="mr-1" />
          Hapus
        </button>
      </div>
    </div>
  );
};

export default CartItem;