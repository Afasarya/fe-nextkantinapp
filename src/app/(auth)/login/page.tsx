'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isValidEmail } from '@/lib/utils';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import { LoginDTO } from '@/types/auth';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginDTO>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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
      authService.setToken(response.token);
      
      toast.success('Login berhasil!');
      
      // Redirect berdasarkan role
      if (authService.hasRole(response.user, 'Stand')) {
        router.push('/stand/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Email atau password salah');
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
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side (Image) - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 relative">
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="max-w-lg">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-600 font-bold text-2xl mr-3">
                K
              </div>
              <span className="text-3xl font-bold text-white">Kantin<span className="text-primary-200">Ku</span></span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">
              Pesan makanan dan minuman dengan mudah
            </h1>
            <p className="text-white/90 text-lg">
              Nikmati kemudahan memesan makanan dan minuman di kantin sekolah tanpa perlu mengantri. Cukup pesan lewat aplikasi dan ambil pesananmu saat sudah siap!
            </p>
          </div>
        </div>
      </div>

      {/* Right side (Login Form) */}
      <div className="flex flex-1 md:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile view */}
          <div className="md:hidden flex justify-center mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl mr-2">
                K
              </div>
              <span className="text-2xl font-bold text-primary-600">Kantin<span className="text-secondary-800">Ku</span></span>
            </div>
          </div>

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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-secondary-700">
                  Ingat saya
                </label>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Lupa password?
              </a>
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
              <Link
                href="/register"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>

          <div className="mt-8 border-t border-secondary-200 pt-6">
            <p className="text-sm text-center text-secondary-600 mb-4">
              Atau masuk dengan
            </p>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center py-2 px-4 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50">
                Google
              </button>
              <button className="flex-1 flex items-center justify-center py-2 px-4 border border-secondary-300 rounded-md shadow-sm text-sm font-medium text-secondary-700 bg-white hover:bg-secondary-50">
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;