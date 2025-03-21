'use client';

import React, { useState, useEffect } from 'react';
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserPlus,
} from 'react-icons/fa';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import { userService } from '@/services/user';
import { User } from '@/types/user';

const AdminCustomersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'email' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form state sesuai model User
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Gagal mengambil data pengguna');
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
    });
    setIsShowingForm(true);
  };

  const handleEditUser = (user: User) => {
    setIsEditMode(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Password kosong saat edit
    });
    setIsShowingForm(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await userService.delete(id);
        setUsers(users.filter(user => user.id !== id));
        toast.success('Pengguna berhasil dihapus');
      } catch (error) {
        toast.error('Gagal menghapus pengguna');
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (isEditMode && currentUser) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          ...(formData.password ? { password: formData.password } : {})
        };
        
        const updatedUser = await userService.update(currentUser.id, updateData);
        setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
        toast.success(`Data pengguna ${updatedUser.name} berhasil diperbarui`);
      } else {
        const newUser = await userService.create(formData);
        setUsers([...users, newUser]);
        toast.success(`Pengguna ${newUser.name} berhasil ditambahkan`);
      }
      setIsShowingForm(false);
    } catch (error) {
      toast.error('Gagal menyimpan data pengguna');
      console.error('Error saving user:', error);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Nama harus diisi');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email harus diisi');
      return false;
    }

    if (!isEditMode && !formData.password) {
      toast.error('Password harus diisi');
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
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <p className="text-secondary-600">
            Kelola data pengguna sistem.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            onClick={handleAddUser}
            className="flex items-center"
          >
            <FaUserPlus className="mr-2" /> Tambah Pengguna
          </Button>
        </div>
      </div>

      {isShowingForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {isEditMode ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={isEditMode ? "Password (Kosongkan jika tidak ingin mengubah)" : "Password"}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!isEditMode}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="primary">
                  {isEditMode ? 'Perbarui Pengguna' : 'Tambah Pengguna'}
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
          <CardTitle>Daftar Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative">
              <Input
                placeholder="Cari pengguna..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <FaSearch className="absolute left-3 top-3 text-secondary-400" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-secondary-600">Memuat data pengguna...</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-secondary-700 uppercase bg-secondary-50">
                  <tr>
                    <th className="px-4 py-3">Nama</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Tanggal Dibuat</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center">
                        <p className="text-secondary-600">Tidak ada data pengguna</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="border-b border-secondary-200 hover:bg-secondary-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium mr-3">
                              {getInitials(user.name)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{formatDate(user.created_at)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
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

export default AdminCustomersPage;