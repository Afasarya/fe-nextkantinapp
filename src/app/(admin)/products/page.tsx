'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaFilter,
  FaCheck,
  FaTimes,
  FaImage,
} from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';

// Product type
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  isAvailable: boolean;
  imageUrl: string;
  tags: string[];
};

// Sample products data
const productsData: Product[] = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    category: 'Makanan Utama',
    price: 15000,
    originalPrice: 18000,
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
    isAvailable: true,
    imageUrl: '/images/food-items/item1.jpg',
    tags: ['Pedas', 'Populer'],
  },
  {
    id: '2',
    name: 'Mie Ayam Bakso',
    category: 'Makanan Utama',
    price: 12000,
    description: 'Mie ayam dengan tambahan bakso sapi yang lezat',
    isAvailable: true,
    imageUrl: '/images/food-items/item2.jpg',
    tags: ['Populer'],
  },
  {
    id: '3',
    name: 'Es Teh Manis',
    category: 'Minuman',
    price: 5000,
    description: 'Teh manis segar dengan es batu',
    isAvailable: true,
    imageUrl: '/images/food-items/item3.jpg',
    tags: ['Dingin'],
  },
  {
    id: '4',
    name: 'Ayam Penyet',
    category: 'Makanan Utama',
    price: 18000,
    description: 'Ayam goreng yang di-penyet dengan sambal terasi pedas',
    isAvailable: false,
    imageUrl: '/images/food-items/item4.jpg',
    tags: ['Pedas', 'Populer'],
  },
  {
    id: '5',
    name: 'Soto Ayam',
    price: 13000,
    category: 'Makanan Utama',
    description: 'Soto ayam dengan kuah bening dan tambahan soun',
    isAvailable: true,
    imageUrl: '/images/food-items/item5.jpg',
    tags: ['Kuah'],
  },
  {
    id: '6',
    name: 'Es Jeruk',
    price: 6000,
    category: 'Minuman',
    description: 'Jeruk segar dengan es batu dan sedikit gula',
    isAvailable: true,
    imageUrl: '/images/food-items/item6.jpg',
    tags: ['Dingin'],
  },
  {
    id: '7',
    name: 'Gado-gado',
    price: 10000,
    category: 'Makanan Utama',
    description: 'Sayuran segar dengan bumbu kacang yang lezat',
    isAvailable: true,
    imageUrl: '/images/food-items/item7.jpg',
    tags: ['Vegetarian'],
  },
  {
    id: '8',
    name: 'Bakso Sapi',
    price: 14000,
    originalPrice: 16000,
    category: 'Makanan Utama',
    description: 'Bakso daging sapi dengan kuah kaldu gurih',
    isAvailable: true,
    imageUrl: '/images/food-items/item8.jpg',
    tags: ['Kuah', 'Populer'],
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

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'price' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showUnavailable, setShowUnavailable] = useState(true);

  // Form state
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: 'Makanan Utama',
    price: 0,
    originalPrice: 0,
    description: '',
    isAvailable: true,
    imageUrl: '',
    tags: '',
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Filter by search query
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Filter by category
      const matchesCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;

      // Filter by availability
      const matchesAvailability = showUnavailable || product.isAvailable;

      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortField === 'price') {
        return sortDirection === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      }

      return 0;
    });

  const handleSort = (field: 'name' | 'price') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddProduct = () => {
    setIsEditMode(false);
    setProductForm({
      id: '',
      name: '',
      category: 'Makanan Utama',
      price: 0,
      originalPrice: 0,
      description: '',
      isAvailable: true,
      imageUrl: '',
      tags: '',
    });
    setIsShowingForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditMode(true);
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      description: product.description,
      isAvailable: product.isAvailable,
      imageUrl: product.imageUrl,
      tags: product.tags.join(', '),
    });
    setIsShowingForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter((product) => product.id !== id));
      toast.success('Produk berhasil dihapus');
    }
  };

  const handleToggleAvailability = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );
    const product = products.find((p) => p.id === id);
    if (product) {
      toast.success(
        `${product.name} ${
          product.isAvailable ? 'tidak tersedia' : 'tersedia'
        }`
      );
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? parseFloat(value)
        : value;

    setProductForm({
      ...productForm,
      [name]: newValue,
    });
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const tagArray = productForm.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const formattedProduct: Product = {
      id: productForm.id || Date.now().toString(),
      name: productForm.name,
      category: productForm.category,
      price: productForm.price,
      originalPrice:
        productForm.originalPrice > 0 ? productForm.originalPrice : undefined,
      description: productForm.description,
      isAvailable: productForm.isAvailable,
      imageUrl:
        productForm.imageUrl || '/images/food-items/default-food.jpg',
      tags: tagArray,
    };

    if (isEditMode) {
      setProducts(
        products.map((product) =>
          product.id === formattedProduct.id ? formattedProduct : product
        )
      );
      toast.success(`Produk ${formattedProduct.name} berhasil diperbarui`);
    } else {
      setProducts([...products, formattedProduct]);
      toast.success(`Produk ${formattedProduct.name} berhasil ditambahkan`);
    }

    setIsShowingForm(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <p className="text-secondary-600">
            Kelola produk makanan dan minuman yang tersedia di kantin.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={handleAddProduct}
            className="flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Produk
          </Button>
        </div>
      </div>

      {isShowingForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Produk"
                  name="name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  required
                />

                <div className="mb-4">
                  <label className="block text-secondary-700 font-medium mb-1">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    required
                  >
                    {categories
                      .filter((cat) => cat !== 'Semua')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Harga (Rp)"
                  name="price"
                  type="number"
                  value={productForm.price.toString()}
                  onChange={handleFormChange}
                  required
                />

                <Input
                  label="Harga Asli (Rp, opsional untuk diskon)"
                  name="originalPrice"
                  type="number"
                  value={productForm.originalPrice.toString()}
                  onChange={handleFormChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-secondary-700 font-medium mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={productForm.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="URL Gambar"
                  name="imageUrl"
                  value={productForm.imageUrl}
                  onChange={handleFormChange}
                  placeholder="URL gambar produk"
                />

                <Input
                  label="Tags (pisahkan dengan koma)"
                  name="tags"
                  value={productForm.tags}
                  onChange={handleFormChange}
                  placeholder="Contoh: Pedas, Populer, Vegetarian"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={productForm.isAvailable}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label
                  htmlFor="isAvailable"
                  className="ml-2 block text-sm text-secondary-700"
                >
                  Tersedia untuk dijual
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">
                  {isEditMode ? 'Perbarui Produk' : 'Tambah Produk'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsShowingForm(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <FaSearch className="absolute left-3 top-3 text-secondary-400" />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-sm text-secondary-600">Tampilkan tidak tersedia:</span>
              <button
                onClick={() => setShowUnavailable(!showUnavailable)}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  showUnavailable ? 'bg-primary-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                    showUnavailable ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Produk</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Nama
                      {sortField === 'name' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3">Kategori</th>
                  <th
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Harga
                      {sortField === 'price' ? (
                        sortDirection === 'asc' ? (
                          <FaSortUp className="ml-1" />
                        ) : (
                          <FaSortDown className="ml-1" />
                        )
                      ) : (
                        <FaSort className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center">
                      <div className="flex flex-col items-center">
                        <FaFilter className="text-secondary-300 mb-2 h-10 w-10" />
                        <p className="text-secondary-600 font-medium">
                          Tidak ada produk yang ditemukan
                        </p>
                        <p className="text-secondary-500 text-sm mt-1">
                          Coba ubah filter atau tambahkan produk baru
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-secondary-200 hover:bg-secondary-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 relative rounded-md overflow-hidden">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-secondary-200 flex items-center justify-center">
                              <FaImage className="text-secondary-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-secondary-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-secondary-500 line-through ml-2">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleAvailability(product.id)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            product.isAvailable
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.isAvailable ? (
                            <>
                              <FaCheck className="mr-1" /> Tersedia
                            </>
                          ) : (
                            <>
                              <FaTimes className="mr-1" /> Tidak Tersedia
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Hapus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsPage;