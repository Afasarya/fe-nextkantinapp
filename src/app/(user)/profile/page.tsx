'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaKey, FaSignOutAlt, FaEdit } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import { User } from '@/types/auth';

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await authService.me();
      setUser(userData);
      setProfileForm({
        name: userData.name,
        email: userData.email,
      });
    } catch (error) {
      toast.error('Gagal memuat data profil');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
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
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Implement update profile API call here
      // await userService.update(user.id, profileForm);
      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
      await fetchUserData(); // Refresh user data
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      setIsLoadingLogout(true);
      await authService.logout();
      authService.removeToken();
      toast.success('Berhasil keluar');
      router.push('/login');
    } catch (error) {
      toast.error('Gagal keluar');
    } finally {
      setIsLoadingLogout(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

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
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                    {getInitials(user.name)}
                  </div>
                  
                  <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                  <p className="text-secondary-600">{user.email}</p>
                  
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
                      onClick={handleLogout}
                      disabled={isLoadingLogout}
                      className="w-full flex items-center p-3 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                    >
                      {isLoadingLogout ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-3"></div>
                      ) : (
                        <FaSignOutAlt className="mr-3" />
                      )}
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
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
                                name: user.name,
                                email: user.email,
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
                          <FaUser className="text-secondary-400 mr-2" /> {user.name}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-secondary-500">Email</h3>
                        <p className="mt-1 text-secondary-900 font-medium flex items-center">
                          <FaEnvelope className="text-secondary-400 mr-2" /> {user.email}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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