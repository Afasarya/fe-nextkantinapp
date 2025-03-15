'use client';

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email tidak valid';
      isValid = false;
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek tidak boleh kosong';
      isValid = false;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Pesan tidak boleh kosong';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Pesan terlalu pendek (minimal 10 karakter)';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Pesan berhasil dikirim! Kami akan menghubungi Anda segera.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  // FAQ items
  const faqItems = [
    {
      question: 'Bagaimana cara mendaftar di KantinKu?',
      answer:
        'Untuk mendaftar, klik tombol "Daftar" di pojok kanan atas halaman atau kunjungi halaman pendaftaran. Isi formulir pendaftaran dengan informasi yang diperlukan, dan akun Anda akan segera aktif.',
    },
    {
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer:
        'Saat ini KantinKu mendukung pembayaran tunai dan kartu di tempat saat pengambilan pesanan. Kami berencana menambahkan metode pembayaran online di update mendatang.',
    },
    {
      question: 'Berapa lama waktu yang dibutuhkan untuk memproses pesanan?',
      answer:
        'Waktu pemrosesan pesanan bervariasi tergantung jenis makanan. Umumnya, pesanan akan siap dalam 10-15 menit setelah konfirmasi.',
    },
    {
      question: 'Apakah saya bisa membatalkan pesanan?',
      answer:
        'Ya, Anda dapat membatalkan pesanan selama statusnya masih "Menunggu Konfirmasi". Setelah pesanan diproses, Anda tidak dapat membatalkannya.',
    },
    {
      question: 'Bagaimana jika ada masalah dengan pesanan saya?',
      answer:
        'Jika ada masalah dengan pesanan Anda, silakan hubungi admin kantin atau kirimkan pesan melalui formulir kontak di halaman ini. Kami akan segera menindaklanjuti keluhan Anda.',
    },
  ];
  
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Hubungi Kami</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Ada pertanyaan atau masukan? Jangan ragu untuk menghubungi kami.
              Tim kami siap membantu Anda.
            </p>
          </div>
        </div>
        <div className="h-16 bg-white rounded-t-[50px] -mb-1"></div>
      </section>
      
      {/* Contact Info & Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 rounded-full p-3 text-primary-600">
                    <FaMapMarkerAlt size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">Alamat</h3>
                    <address className="not-italic text-secondary-600 mt-1">
                      Jl. Pendidikan No. 123<br />
                      Kota Jakarta, 12345<br />
                      Indonesia
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 rounded-full p-3 text-primary-600">
                    <FaPhone size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">Telepon</h3>
                    <p className="text-secondary-600 mt-1">(021) 1234-5678</p>
                    <p className="text-secondary-600">0812-3456-7890 (WhatsApp)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 rounded-full p-3 text-primary-600">
                    <FaEnvelope size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-secondary-600 mt-1">info@kantinku.com</p>
                    <p className="text-secondary-600">support@kantinku.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-primary-100 rounded-full p-3 text-primary-600">
                    <FaClock size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">Jam Operasional</h3>
                    <p className="text-secondary-600 mt-1">Senin - Jumat: 07:00 - 16:00</p>
                    <p className="text-secondary-600">Sabtu: 08:00 - 14:00</p>
                    <p className="text-secondary-600">Minggu: Tutup</p>
                  </div>
                </div>
              </div>
              
              {/* Map (Placeholder) */}
              <div className="mt-8 bg-secondary-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-secondary-500 mb-2">Peta Lokasi</p>
                  <p className="text-secondary-600 text-sm">
                    Tampilan peta akan muncul di sini. Untuk implementasi nyata, gunakan
                    Google Maps atau layanan peta serupa.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                
                <div className="mb-4">
                  <label className="block text-secondary-700 font-medium mb-1">
                    Subjek
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                      errors.subject ? 'border-red-500' : 'border-secondary-300'
                    }`}
                  >
                    <option value="">Pilih Subjek</option>
                    <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                    <option value="Dukungan Teknis">Dukungan Teknis</option>
                    <option value="Kerjasama">Kerjasama</option>
                    <option value="Masukan">Masukan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-secondary-700 font-medium mb-1">
                    Pesan
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 ${
                      errors.message ? 'border-red-500' : 'border-secondary-300'
                    }`}
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                  {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  className="mt-2"
                  isLoading={isSubmitting}
                >
                  <FaPaperPlane className="mr-2" /> Kirim Pesan
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-secondary-600">
              Temukan jawaban untuk pertanyaan umum tentang KantinKu.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto divide-y divide-secondary-200">
            {faqItems.map((item, index) => (
              <div key={index} className="py-6">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {item.question}
                </h3>
                <p className="mt-2 text-secondary-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Belum Menemukan Jawaban?</h2>
            <p className="text-lg text-white/90 mb-8">
              Jika pertanyaan Anda belum terjawab, jangan ragu untuk menghubungi tim
              dukungan kami. Kami siap membantu Anda!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                className="bg-white text-primary-600 hover:bg-secondary-100"
                onClick={() => {
                  const contactForm = document.querySelector('#contact-form');
                  if (contactForm) {
                    contactForm.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Hubungi Kami
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.open('mailto:support@kantinku.com')}
              >
                Email Support
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
};

export default ContactPage;