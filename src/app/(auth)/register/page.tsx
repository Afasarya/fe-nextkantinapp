'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { isValidEmail } from '@/lib/utils';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Nama tidak boleh kosong';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email tidak valid';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor telepon tidak boleh kosong';
      isValid = false;
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Nomor telepon tidak valid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      isValid = false;
    }

    if (!agreeToTerms) {
      newErrors.terms = 'Anda harus menyetujui syarat dan ketentuan';
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

    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would be an API call to register
      // For now, let's just simulate success
      toast.success('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.');
      router.push('/login');
      setIsLoading(false);
    }, 1500);
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
              Bergabunglah dengan KantinKu
            </h1>
            <p className="text-white/90 text-lg">
              Daftar sekarang dan nikmati kemudahan memesan makanan dan minuman di kantin sekolah tanpa perlu mengantri.
            </p>
          </div>
        </div>
      </div>

      {/* Right side (Registration Form) */}
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
            <h1 className="text-2xl font-bold text-secondary-900">Buat Akun Baru</h1>
            <p className="text-secondary-600 mt-2">
              Daftarkan diri Anda untuk mulai memesan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-secondary-500" />
              </div>
              <Input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                className="pl-10"
              />
            </div>

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
                <FaPhone className="text-secondary-500" />
              </div>
              <Input
                type="tel"
                name="phone"
                placeholder="Nomor Telepon"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
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

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-secondary-500" />
              </div>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                className="pl-10 pr-10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-secondary-500 hover:text-secondary-700 focus:outline-none"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-secondary-700">
                    Saya menyetujui{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Syarat dan Ketentuan
                    </a>{' '}
                    serta{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Kebijakan Privasi
                    </a>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Daftar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600">
              Sudah punya akun?{' '}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;