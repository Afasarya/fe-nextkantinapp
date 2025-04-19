"use client";

import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { formatCurrency, getImageUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface FoodCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  originalPrice?: number;
  discountPrice?: number | null;
  onAddToCart: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  name,
  price,
  description,
  imageUrl,
  originalPrice,
  discountPrice,
  onAddToCart,
}) => {
  const hasDiscount = originalPrice && discountPrice;
  const imageUrlFixed = getImageUrl(imageUrl);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={imageUrlFixed}
          alt={name}
          className="w-full h-full object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            Diskon
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-secondary-900 mb-1 line-clamp-1">
          {name}
        </h3>
        
        <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            {hasDiscount ? (
              <>
                <p className="text-primary-600 font-semibold">
                  {formatCurrency(discountPrice || 0)}
                </p>
                <p className="text-secondary-500 text-sm line-through">
                  {formatCurrency(originalPrice)}
                </p>
              </>
            ) : (
              <p className="text-primary-600 font-semibold">
                {formatCurrency(price)}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={onAddToCart}
          className="flex items-center justify-center gap-2"
        >
          <FaShoppingCart size={16} />
          <span>Tambah ke Keranjang</span>
        </Button>
      </div>
    </div>
  );
};

export default FoodCard;