'use client';

import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaStore,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import { standService } from '@/services/stand';
import { userService } from '@/services/user';
import { Stand } from '@/types/stand';
import { User } from '@/types/user';

const AdminStandsPage = () => {
  const [stands, setStands] = useState<Stand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStand, setCurrentStand] = useState<Stand | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    fetchStands();
    fetchUsers();
  }, []);

  const fetchStands = async () => {
    try {
      setIsLoading(true);
      const data = await standService.getAll();
      setStands(data);
    } catch (error) {
      toast.error('Gagal mengambil data stand');
      console.error('Error fetching stands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Gagal mengambil data pengguna');
      console.error('Error fetching users:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAddStand = () => {
    setIsEditMode(false);
    setCurrentStand(null);
    setFormData({
      user_id: '',
      name: '',
      slug: '',
      description: '',
    });
    setIsShowingForm(true);
  };

  const handleEditStand = (stand: Stand) => {
    setIsEditMode(true);
    setCurrentStand(stand);
    setFormData({
      user_id: stand.user_id.toString(),
      name: stand.name,
      slug: stand.slug,
      description: stand.description,
    });
    setIsShowingForm(true);
  };

  const handleDeleteStand = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus stand ini?')) {
      try {
        await standService.delete(id);
        setStands(stands.filter(stand => stand.id !== id));
        toast.success('Stand berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus stand');
        console.error('Error deleting stand:', error);
      }
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setFormData({
        ...formData,
        name: value,
        slug: generateSlug(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const standData = {
        user_id: parseInt(formData.user_id),
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
      };

      if (isEditMode && currentStand) {
        const updatedStand = await standService.update(currentStand.id, standData);
        setStands(stands.map(stand => stand.id === updatedStand.id ? updatedStand : stand));
        toast.success(`Stand ${updatedStand.name} berhasil diperbarui`);
      } else {
        const newStand = await standService.create(standData);
        setStands([...stands, newStand]);
        toast.success(`Stand ${newStand.name} berhasil ditambahkan`);
      }
      setIsShowingForm(false);
    } catch (error) {
      toast.error('Gagal menyimpan data stand');
      console.error('Error saving stand:', error);
    }
  };

  const validateForm = () => {
    if (!formData.user_id) {
      toast.error('Pemilik stand harus dipilih');
      return false;
    }
    if (!formData.name.trim()) {
      toast.error('Nama stand harus diisi');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Deskripsi harus diisi');
      return false;
    }
    return true;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Stand</h1>
          <p className="text-secondary-600">
            Kelola data stand kantin.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={handleAddStand}
            className="flex items-center"
          >
            <FaStore className="mr-2" /> Tambah Stand
          </Button>
        </div>
      </div>

      {isShowingForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Stand' : 'Tambah Stand Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pemilik Stand
                  </label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Pilih Pemilik Stand</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Nama Stand"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <Input
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleFormChange}
                disabled
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">
                  {isEditMode ? 'Perbarui Stand' : 'Tambah Stand'}
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
          <CardTitle>Daftar Stand</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Cari stand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-secondary-600">Memuat data stand...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3">Nama Stand</th>
                    <th className="px-4 py-3">Pemilik</th>
                    <th className="px-4 py-3">Deskripsi</th>
                    <th className="px-4 py-3">Tanggal Dibuat</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {stands.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center">
                        <p className="text-secondary-600">Tidak ada data stand</p>
                      </td>
                    </tr>
                  ) : (
                    stands
                      .filter(stand => 
                        stand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        stand.description.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((stand) => (
                        <tr key={stand.id} className="border-b border-secondary-200 hover:bg-secondary-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium mr-3">
                                {getInitials(stand.name)}
                              </div>
                              <span>{stand.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{stand.user?.name || '-'}</td>
                          <td className="px-4 py-3">{stand.description}</td>
                          <td className="px-4 py-3">{formatDate(stand.created_at)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditStand(stand)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteStand(stand.id)}
                                className="text-red-600 hover:text-red-700"
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

export default AdminStandsPage;