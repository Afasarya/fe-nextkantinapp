'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaPhone, FaEnvelope, FaKey, FaHistory, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

// Sample user data
const userData = {
  id: '123',
  name: 'Budi Santoso',
  email: 'budi.santoso@example.com',
  phone: '081234567890',
  joinDate: '2023-10-15T08:30:00Z',
  orderCount: 15,
  profileImage: null,
};

// Sample recent orders
const recentOrders = [
  {
    id: '1',
    orderNumber: 'ORD-20240315-001',
    date: '2024-03-15T10:30:00Z',
    total: 55000,
    status: 'processing',
  },
  {
    id: '2',
    orderNumber: 'ORD-20240314-005',
    date: '2024-03-14T12:15:00Z',
    total: 18000,
    status: 'completed',
  },
  {
    id: '3',
    orderNumber: 'ORD-20240313-010',
    date: '2024-03-13T09:45:00Z',
    total: 19000,
    status: 'completed',
  },
];

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!profileForm.name.trim()) {
      newErrors.name = 'Nama tidak boleh kosong';
      isValid = false;
    }
    
    if (!profileForm.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email tidak valid';
      isValid = false;
    }
    
    if (!profileForm.phone.trim()) {
      newErrors.phone = 'Nomor telepon tidak boleh kosong';
      isValid = false;
    } else if (!/^[0-9]{10,13}$/.test(profileForm.phone.trim())) {
      newErrors.phone = 'Nomor telepon tidak valid';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Password saat ini tidak boleh kosong';
      isValid = false;
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'Password baru tidak boleh kosong';
      isValid = false;
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = 'Password baru minimal 8 karakter';
      isValid = false;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Password berhasil diperbarui');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const handleLogout = () => {
    // Simulate logout
    toast.success('Berhasil keluar');
    router.push('/login');
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <main className="min-h-screen bg-secondary-50">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Profil Saya</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  {userData.profileImage ? (
                    <div className="w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={userData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                      {getInitials(userData.name)}
                    </div>
                  )}
                  
                  <h2 className="mt-4 text-xl font-semibold">{userData.name}</h2>
                  <p className="text-secondary-600">{userData.email}</p>
                  <p className="text-sm text-secondary-500 mt-1">
                    Bergabung sejak {new Date(userData.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  
                  <div className="w-full border-t border-secondary-200 my-6"></div>
                  
                  <div className="w-full space-y-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center p-3 rounded-md transition-colors ${
                        activeTab === 'profile'
                          ? 'bg-primary-50 text-primary-600'
                          : 'hover:bg-secondary-100'
                      }`}
                    >
                      <FaUser className="mr-3" />
                      <span>Informasi Profil</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('password')}
                      className={`w-full flex items-center p-3 rounded-md transition-colors ${
                        activeTab === 'password'
                          ? 'bg-primary-50 text-primary-600'
                          : 'hover:bg-secondary-100'
                      }`}
                    >
                      <FaKey className="mr-3" />
                      <span>Ubah Password</span>
                    </button>
                    
                    <button
                      onClick={() => router.push('/orders')}
                      className="w-full flex items-center p-3 rounded-md hover:bg-secondary-100 transition-colors"
                    >
                      <FaHistory className="mr-3" />
                      <span>Riwayat Pesanan</span>
                    </button>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center p-3 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Statistics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistik Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-600">{userData.orderCount}</p>
                  <p className="text-secondary-600">Total Pesanan</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" fullWidth onClick={() => router.push('/orders')}>
                  Lihat Semua Pesanan
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Informasi Profil</CardTitle>
                    {!isEditing ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </Button>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleProfileSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                              Nama Lengkap
                            </label>
                            <Input
                              id="name"
                              name="name"
                              value={profileForm.name}
                              onChange={handleProfileChange}
                              error={errors.name}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                              Email
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={profileForm.email}
                              onChange={handleProfileChange}
                              error={errors.email}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                              Nomor Telepon
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              error={errors.phone}
                            />
                          </div>
                          
                          <div className="flex gap-3 pt-4">
                            <Button type="submit" variant="primary" isLoading={isLoading}>
                              Simpan Perubahan
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {
                                setIsEditing(false);
                                setProfileForm({
                                  name: userData.name,
                                  email: userData.email,
                                  phone: userData.phone,
                                });
                                setErrors({});
                              }}
                            >
                              Batal
                            </Button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500">Nama Lengkap</h3>
                          <p className="mt-1 text-secondary-900 font-medium flex items-center">
                            <FaUser className="text-secondary-400 mr-2" /> {userData.name}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500">Email</h3>
                          <p className="mt-1 text-secondary-900 font-medium flex items-center">
                            <FaEnvelope className="text-secondary-400 mr-2" /> {userData.email}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500">Nomor Telepon</h3>
                          <p className="mt-1 text-secondary-900 font-medium flex items-center">
                            <FaPhone className="text-secondary-400 mr-2" /> {userData.phone}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-secondary-500">Tanggal Bergabung</h3>
                          <p className="mt-1 text-secondary-900 font-medium">
                            {new Date(userData.joinDate).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recent Orders */}
                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Pesanan Terbaru</CardTitle>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push('/orders')}
                    >
                      Lihat Semua
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentOrders.length > 0 ? (
                      <div className="divide-y divide-secondary-200">
                        {recentOrders.map((order) => (
                          <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{order.orderNumber}</h3>
                                <p className="text-sm text-secondary-500 mt-1">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-primary-600">
                                  Rp {order.total.toLocaleString('id-ID')}
                                </span>
                                <p className={`text-sm mt-1 ${
                                  order.status === 'completed'
                                    ? 'text-green-600'
                                    : order.status === 'cancelled'
                                    ? 'text-red-600'
                                    : 'text-blue-600'
                                }`}>
                                  {order.status === 'completed'
                                    ? 'Selesai'
                                    : order.status === 'cancelled'
                                    ? 'Dibatalkan'
                                    : 'Diproses'}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => router.push(`/orders/${order.id}`)}
                              >
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-secondary-500">Belum ada pesanan</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeTab === 'password' && (
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="block text-sm font-medium text-secondary-700 mb-1"
                        >
                          Password Saat Ini
                        </label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          error={errors.currentPassword}
                        />
                      </div>
                      
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block text-sm font-medium text-secondary-700 mb-1"
                        >
                          Password Baru
                        </label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          error={errors.newPassword}
                        />
                      </div>
                      
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-secondary-700 mb-1"
                        >
                          Konfirmasi Password Baru
                        </label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          error={errors.confirmPassword}
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button type="submit" variant="primary" isLoading={isLoading}>
                          Perbarui Password
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default ProfilePage;