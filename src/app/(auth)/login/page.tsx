'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Tidak digunakan lagi
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isValidEmail } from '@/lib/utils';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import { LoginDTO } from '@/types/auth';

const LoginPage = () => {
  // const router = useRouter(); // Tidak digunakan lagi
  const [formData, setFormData] = useState<LoginDTO>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Fix: Menambahkan router ke dependency array dan menambahkan flag untuk mencegah multiple check
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = authService.getUserFromStorage();
          if (isMounted) {
            // Cek roles (array) atau role (string) dari backend
            if ((user?.roles && user.roles.includes('Stand')) || user?.role === 'Stand') {
              window.location.href = '/dashboard';
            } else if ((user?.roles && user.roles.includes('Student')) || user?.role === 'Student') {
              window.location.href = '/';
            }
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        // Update state hanya jika komponen masih di-mount
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };
    
    checkAuth();
    
    // Cleanup function untuk mencegah memory leak dan update state pada unmounted component
    return () => {
      isMounted = false;
    };
  }, []); 

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!formData.email) {
      newErrors.email = 'Email tidak boleh kosong';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email tidak valid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(formData);

      if (response.status === 'success' && response.data) {
        // Simpan data login terlebih dahulu
        const user = response.data.user;
        console.log('Login success, user data:', user);
        
        // Tentukan halaman tujuan
        let redirectUrl = '/';
        if ((user.roles && user.roles.includes('Stand')) || user.role === 'Stand') {
          redirectUrl = '/dashboard';
        }
        
        // Tampilkan toast sukses
        toast.success('Login berhasil!');
        
        // Gunakan pendekatan direct browser navigation setelah delay
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1500);
      } else {
        toast.error(response.message || 'Gagal melakukan login');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Terjadi kesalahan saat login');
      }

      setFormData(prev => ({
        ...prev,
        password: ''
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Tampilkan loading jika masih memeriksa autentikasi
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-primary-600 relative">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-6">
              Pesan makanan dan minuman dengan mudah
            </h1>
            <p className="text-white/90 text-lg">
              Nikmati kemudahan memesan makanan dan minuman di kantin sekolah tanpa perlu mengantri.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary-900">Selamat Datang Kembali</h1>
            <p className="text-secondary-600 mt-2">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-secondary-500" />
              </div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-secondary-500" />
              </div>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="pl-10 pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-secondary-500 hover:text-secondary-700 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Masuk
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;