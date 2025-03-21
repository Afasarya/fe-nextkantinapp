'use client';

import React, { useState, useEffect } from 'react';
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
import { Food, CreateFoodDTO, UpdateFoodDTO } from '@/types/food';
import { foodService } from '@/services/food';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const AdminProductsPage = () => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'price' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentFood, setCurrentFood] = useState<Food | null>(null);

  // Form state sesuai dengan CreateFoodDTO
  const [foodForm, setFoodForm] = useState<{
    name: string;
    slug: string;
    description: string;
    price: number;
    is_discount: boolean;
    discount?: number;
    image: File | null;
  }>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    is_discount: false,
    discount: 0,
    image: null,
  });

  // Fetch foods saat komponen dimount
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      const data = await foodService.getAll();
      setFoods(data);
    } catch (error) {
      toast.error('Gagal mengambil data makanan');
      console.error('Error fetching foods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate slug dari nama
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAddFood = () => {
    setIsEditMode(false);
    setCurrentFood(null);
    setFoodForm({
      name: '',
      slug: '',
      description: '',
      price: 0,
      is_discount: false,
      discount: 0,
      image: null,
    });
    setIsShowingForm(true);
  };

  const handleEditFood = (food: Food) => {
    setIsEditMode(true);
    setCurrentFood(food);
    setFoodForm({
      name: food.name,
      slug: food.slug,
      description: food.description,
      price: food.price,
      is_discount: food.is_discount,
      discount: food.discount || 0,
      image: null,
    });
    setIsShowingForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFoodForm(prev => ({
        ...prev,
        [name]: checked,
        // Reset discount jika is_discount dinonaktifkan
        ...(name === 'is_discount' && !checked && { discount: 0 }),
      }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setFoodForm(prev => ({
          ...prev,
          image: files[0],
        }));
      }
    } else if (name === 'name') {
      setFoodForm(prev => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    } else {
      setFoodForm(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      }));
    }
  };

  const handleSubmitFood = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validasi form terlebih dahulu
      if (!foodForm.name.trim()) {
        toast.error('Nama makanan harus diisi');
        return;
      }
      if (!foodForm.description.trim()) {
        toast.error('Deskripsi harus diisi');
        return;
      }
      if (foodForm.price <= 0) {
        toast.error('Harga harus lebih dari 0');
        return;
      }
      if (foodForm.is_discount && (!foodForm.discount || foodForm.discount <= 0 || foodForm.discount > 100)) {
        toast.error('Diskon harus antara 1-100%');
        return;
      }
      if (!foodForm.image && !isEditMode) {
        toast.error('Gambar makanan harus diupload');
        return;
      }

      const formData = new FormData();
      formData.append('name', foodForm.name);
      formData.append('slug', foodForm.slug);
      formData.append('description', foodForm.description);
      formData.append('price', Math.floor(foodForm.price).toString()); // Pastikan integer
      formData.append('is_discount', foodForm.is_discount ? '1' : '0'); // Konversi ke string '1' atau '0'

      if (foodForm.is_discount && foodForm.discount) {
        formData.append('discount', foodForm.discount.toString());
      }

      if (foodForm.image) {
        formData.append('image', foodForm.image);
      }

      if (isEditMode && currentFood) {
        // Untuk update, gunakan method PUT/PATCH
        formData.append('_method', 'PUT'); // Laravel method spoofing
        await foodService.update(currentFood.id, formData);
        toast.success(`Makanan ${foodForm.name} berhasil diperbarui`);
      } else {
        await foodService.create(formData);
        toast.success(`Makanan ${foodForm.name} berhasil ditambahkan`);
      }

      fetchFoods(); // Refresh data
      setIsShowingForm(false);
    } catch (error: any) {
      // Tampilkan pesan error yang lebih spesifik
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Tampilkan error validasi
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error('Gagal menyimpan data makanan');
      }
      console.error('Error saving food:', error);
    }
  };

  const handleDeleteFood = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus makanan ini?')) {
      try {
        await foodService.delete(id);
        setFoods(foods.filter(food => food.id !== id));
        toast.success('Makanan berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus makanan');
        console.error('Error deleting food:', error);
      }
    }
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
            onClick={handleAddFood}
            className="flex items-center"
          >
            <FaPlus className="mr-2" /> Tambah Produk
          </Button>
        </div>
      </div>

      {isShowingForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Makanan' : 'Tambah Makanan Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFood} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Makanan"
                  name="name"
                  value={foodForm.name}
                  onChange={handleFormChange}
                  required
                />

                <Input
                  label="Slug"
                  name="slug"
                  value={foodForm.slug}
                  onChange={handleFormChange}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-secondary-700 font-medium mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={foodForm.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Harga (Rp)"
                  name="price"
                  type="number"
                  value={foodForm.price.toString()}
                  onChange={handleFormChange}
                  required
                />

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_discount"
                      name="is_discount"
                      checked={foodForm.is_discount}
                      onChange={handleFormChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                    />
                    <label
                      htmlFor="is_discount"
                      className="ml-2 block text-sm text-secondary-700"
                    >
                      Aktifkan Diskon
                    </label>
                  </div>

                  {foodForm.is_discount && (
                    <Input
                      label="Diskon (%)"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={foodForm.discount?.toString() || '0'}
                      onChange={handleFormChange}
                      required
                    />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-secondary-700 font-medium mb-1">
                  Gambar Makanan
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleFormChange}
                  accept="image/*"
                  className="w-full"
                  required={!isEditMode}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">
                  {isEditMode ? 'Perbarui Makanan' : 'Tambah Makanan'}
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Daftar Makanan</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Cari makanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-secondary-600">Memuat data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3">Gambar</th>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Harga</th>
                    <th className="px-4 py-3">Diskon</th>
                    <th className="px-4 py-3">Harga Setelah Diskon</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center">
                        Tidak ada data makanan
                      </td>
                    </tr>
                  ) : (
                    foods.map((food) => (
                      <tr key={food.id} className="border-b">
                        <td className="px-4 py-3">
                          {/* <div className="h-12 w-12 relative">
                            <Image
                              src={food.image}
                              alt={food.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div> */}
                        </td>
                        <td className="px-4 py-3">{food.name}</td>
                        <td className="px-4 py-3">
                          {formatCurrency(food.price)}
                        </td>
                        <td className="px-4 py-3">
                          {food.is_discount ? `${food.discount}%` : '-'}
                        </td>
                        <td className="px-4 py-3">
                          {food.discount_price ? formatCurrency(food.discount_price) : '-'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFood(food)}
                              className="text-blue-600"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFood(food.id)}
                              className="text-red-600"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProductsPage;