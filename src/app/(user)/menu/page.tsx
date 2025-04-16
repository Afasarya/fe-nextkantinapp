'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FoodCard from '@/components/user/FoodCard';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { foodService } from '@/services/food';
import { cartService } from '@/services/cart';
import { Food } from '@/types/food';
import { authService } from '@/services/auth';

// Categories
const categories = [
  'Semua',
  'Makanan Utama',
  'Makanan Ringan',
  'Minuman',
  'Camilan',
  'Dessert',
];

// Sample tags
const tags = ['Populer', 'Pedas', 'Vegetarian', 'Kuah', 'Dingin'];

const MenuPage = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const data = await foodService.getAll();
      setFoods(data);
    } catch (error) {
      toast.error('Gagal memuat data menu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (id: number) => {
    if (!authService.isAuthenticated()) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    const food = foods.find(f => f.id === id);
    if (!food) {
      toast.error('Makanan tidak ditemukan');
      return;
    }

    try {
      await cartService.create({
        food_id: id,
        quantity: 1,
        price: food.price
      });
      toast.success('Berhasil menambahkan ke keranjang');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan ke keranjang';
      toast.error(message);
    }
  };

  // Filter foods based on search query and category
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort foods based on selected sort option
  const sortedFoods = [...filteredFoods].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Menu Kantin</h1>
            <p className="text-secondary-600 mt-1">
              Pilih makanan dan minuman favoritmu
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="p-2 border border-secondary-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="popularity">Paling Populer</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price-low">Harga Terendah</option>
              <option value="price-high">Harga Tertinggi</option>
            </select>
            
            <button
              onClick={() => setIsFilterModalOpen(!isFilterModalOpen)}
              className="ml-2 p-2 rounded-md bg-secondary-100 text-secondary-800 hover:bg-secondary-200 transition-colors md:hidden"
            >
              <FaFilter />
            </button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters (desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-secondary-100">
              <h3 className="font-semibold mb-3">Pencarian</h3>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari menu..."
                  className="w-full p-2 pl-8 border border-secondary-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <FaSearch className="absolute left-2.5 top-3 text-secondary-400" />
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-3">Kategori</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={category}
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded-full"
                      />
                      <label htmlFor={category} className="ml-2 text-sm text-secondary-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedTags.includes(tag)
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      } transition-colors`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile filters modal */}
            {isFilterModalOpen && (
              <div className="md:hidden bg-white p-4 rounded-lg shadow-md mb-4 border border-secondary-100">
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">Pencarian</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari menu..."
                      className="w-full p-2 pl-8 border border-secondary-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <FaSearch className="absolute left-2.5 top-3 text-secondary-400" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-semibold mb-3">Kategori</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-xs px-3 py-1.5 rounded-full ${
                          selectedCategory === category
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                        } transition-colors`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Tag</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedTags.includes(tag)
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                        } transition-colors`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Results count and grid */}
            <div>
              <p className="text-secondary-600 mb-4">
                Menampilkan {sortedFoods.length} item
              </p>
              
              {sortedFoods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedFoods.map((food) => (
                    <FoodCard
                      key={food.id}
                      id={food.id}
                      name={food.name}
                      price={food.price}
                      originalPrice={food.is_discount ? food.price : undefined}
                      discountPrice={food.is_discount ? food.discount_price : undefined}
                      imageUrl={food.image}
                      description={food.description}
                      onAddToCart={() => handleAddToCart(food.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-lg border border-secondary-100">
                  <h3 className="text-lg font-semibold mb-2">
                    Menu tidak ditemukan
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    Coba ubah filter atau kata kunci pencarian kamu
                  </p>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Semua');
                      setSelectedTags([]);
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default MenuPage;