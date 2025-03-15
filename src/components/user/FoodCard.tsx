"use client";

import React from 'react';
import Image from 'next/image';
import { FaPlus, FaStar } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';

interface FoodCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  imageUrl: string;
  isAvailable?: boolean;
  onAddToCart: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  category,
  rating,
  imageUrl,
  isAvailable = true,
  onAddToCart,
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="card group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        {/* Food Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Availability Badge */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold">Stok Habis</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-secondary-800 px-2 py-1 rounded-full text-xs font-semibold">
            {category}
          </div>
        </div>
        
        {/* Add to Cart Button (only shown if available) */}
        {isAvailable && (
          <button
            onClick={() => onAddToCart(id)}
            className="absolute -bottom-4 right-4 rounded-full w-10 h-10 bg-primary-600 text-white shadow-lg flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:bg-primary-700"
            aria-label="Add to cart"
          >
            <FaPlus />
          </button>
        )}
      </div>

      <div className="p-4 pt-5">
        {/* Food Name */}
        <h3 className="font-semibold text-lg text-secondary-800 mb-1 line-clamp-1">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <FaStar className="text-yellow-400 mr-1" />
          <span className="text-sm text-secondary-600">{rating.toFixed(1)}</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center mt-2">
          <span className="font-bold text-primary-600">
            {formatCurrency(price)}
          </span>
          
          {hasDiscount && (
            <span className="ml-2 text-sm text-secondary-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;