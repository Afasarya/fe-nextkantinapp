'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/');
    }
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
      console.log('Login Response:', response); // Debugging

      if (response && response.token && response.user) {
        authService.setToken(response.token);
        toast.success('Login berhasil!');

        setTimeout(() => {
          if (authService.hasRole(response.user, 'Stand')) {
            router.push('/stand/dashboard');
          } else {
            router.push('/');
          }
        }, 1000);
      } else {
        toast.error('Data login tidak lengkap, silakan coba lagi.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email atau password salah';
      toast.error(errorMessage);

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
  };

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
