"use client";

import React from 'react';
import Image from 'next/image';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  notes?: string;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  imageUrl,
  notes = '',
  onIncrement,
  onDecrement,
  onRemove,
  onNotesChange,
}) => {
  return (
    <div className="border-b border-secondary-200 py-4">
      <div className="flex items-start">
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Product Details */}
        <div className="ml-4 flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-secondary-800">{name}</h3>
              <p className="text-primary-600 font-semibold mt-1">
                {formatCurrency(price)}
              </p>
            </div>
            <button
              onClick={() => onRemove(id)}
              className="text-red-500 hover:text-red-600 transition-colors"
              aria-label="Remove item"
            >
              <FaTrash size={16} />
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center mt-3">
            <div className="flex items-center border border-secondary-300 rounded-lg overflow-hidden">
              <button
                onClick={() => onDecrement(id)}
                disabled={quantity <= 1}
                className={`p-2 ${
                  quantity <= 1
                    ? 'text-secondary-400 bg-secondary-100'
                    : 'text-secondary-600 hover:bg-secondary-100'
                }`}
                aria-label="Decrease quantity"
              >
                <FaMinus size={12} />
              </button>
              <span className="px-4 py-1 text-center min-w-[40px]">
                {quantity}
              </span>
              <button
                onClick={() => onIncrement(id)}
                className="p-2 text-secondary-600 hover:bg-secondary-100"
                aria-label="Increase quantity"
              >
                <FaPlus size={12} />
              </button>
            </div>

            <span className="ml-4 text-secondary-700 font-semibold">
              {formatCurrency(price * quantity)}
            </span>
          </div>

          {/* Notes Input */}
          <div className="mt-2">
            <input
              type="text"
              value={notes}
              onChange={(e) => onNotesChange(id, e.target.value)}
              placeholder="Catatan (opsional)"
              className="w-full text-sm border border-secondary-200 rounded-md px-3 py-1 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;