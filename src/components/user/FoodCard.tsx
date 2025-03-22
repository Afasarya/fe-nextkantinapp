"use client";

import React from 'react';
import Image from 'next/image';
import { FaPlus, FaStar } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface FoodCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountPrice?: number | null;
  imageUrl: string;
  description: string;
  onAddToCart: (id: number) => void;
}

const FoodCard = ({
  id,
  name,
  price,
  originalPrice,
  discountPrice,
  imageUrl,
  description,
  onAddToCart,
}: FoodCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-secondary-100">
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover"
        />
        {discountPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            Diskon
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-secondary-600 text-sm mb-2 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            {discountPrice ? (
              <>
                <span className="text-red-500 font-semibold">
                  Rp {discountPrice.toLocaleString('id-ID')}
                </span>
                <span className="text-secondary-400 text-sm line-through ml-2">
                  Rp {price.toLocaleString('id-ID')}
                </span>
              </>
            ) : (
              <span className="text-primary-600 font-semibold">
                Rp {price.toLocaleString('id-ID')}
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(id)}
            className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm hover:bg-primary-700 transition-colors"
          >
            + Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;