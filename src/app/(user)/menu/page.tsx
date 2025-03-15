'use client';

import React, { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FoodCard from '@/components/user/FoodCard';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

// Sample food data
const foodData = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 15000,
    originalPrice: 18000,
    category: 'Makanan Utama',
    rating: 4.8,
    imageUrl: '/images/food-items/item1.jpg',
    tags: ['Pedas', 'Populer'],
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    price: 12000,
    category: 'Makanan Utama',
    rating: 4.5,
    imageUrl: '/images/food-items/item2.jpg',
    tags: ['Populer'],
    description: 'Mie ayam dengan tambahan bakso sapi yang lezat',
  },
  {
    id: '3',
    name: 'Es Teh Manis',
    price: 5000,
    category: 'Minuman',
    rating: 4.3,
    imageUrl: '/images/food-items/item3.jpg',
    tags: ['Dingin'],
    description: 'Teh manis segar dengan es batu',
  },
  {
    id: '4',
    name: 'Ayam Penyet',
    price: 18000,
    category: 'Makanan Utama',
    rating: 4.7,
    imageUrl: '/images/food-items/item4.jpg',
    tags: ['Pedas', 'Populer'],
    description: 'Ayam goreng yang di-penyet dengan sambal terasi pedas',
  },
  {
    id: '5',
    name: 'Soto Ayam',
    price: 13000,
    category: 'Makanan Utama',
    rating: 4.6,
    imageUrl: '/images/food-items/item5.jpg',
    tags: ['Kuah'],
    description: 'Soto ayam dengan kuah bening dan tambahan soun',
  },
  {
    id: '6',
    name: 'Es Jeruk',
    price: 6000,
    category: 'Minuman',
    rating: 4.4,
    imageUrl: '/images/food-items/item6.jpg',
    tags: ['Dingin'],
    description: 'Jeruk segar dengan es batu dan sedikit gula',
  },
  {
    id: '7',
    name: 'Gado-gado',
    price: 10000,
    category: 'Makanan Utama',
    rating: 4.2,
    imageUrl: '/images/food-items/item7.jpg',
    tags: ['Vegetarian'],
    description: 'Sayuran segar dengan bumbu kacang yang lezat',
  },
  {
    id: '8',
    name: 'Bakso Sapi',
    price: 14000,
    originalPrice: 16000,
    category: 'Makanan Utama',
    rating: 4.7,
    imageUrl: '/images/food-items/item8.jpg',
    tags: ['Kuah', 'Populer'],
    description: 'Bakso daging sapi dengan kuah kaldu gurih',
  },
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('popularity');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter foods based on search query, category, and tags
  const filteredFoods = foodData.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || food.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => food.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  // Sort foods based on selected sort option
  const sortedFoods = [...filteredFoods].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
      default:
        return b.rating - a.rating; // Default sort by rating as a proxy for popularity
    }
  });

  const handleAddToCart = (id: string) => {
    // In a real app, this would add the item to the cart
    // For now, we'll just show a toast message
    const foodItem = foodData.find(food => food.id === id);
    if (foodItem) {
      toast.success(`${foodItem.name} ditambahkan ke keranjang`);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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
                      originalPrice={food.originalPrice}
                      category={food.category}
                      rating={food.rating}
                      imageUrl={food.imageUrl}
                      onAddToCart={handleAddToCart}
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