"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaUtensils, FaSearch, FaClock, FaShoppingBag, FaStar } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import FoodCard from '@/components/user/FoodCard';
import { foodService } from '@/services/food';
import { cartService } from '@/services/cart';
import { Food } from '@/types/food';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

// Sample food data
// Data contoh tidak digunakan karena kita sekarang menggunakan API
// HAPUS DATA CONTOH YANG SEBENARNYA TIDAK DIGUNAKAN

// Sample testimonials
const testimonials = [
  {
    id: '1',
    name: 'Budi Santoso',
    role: 'Siswa Kelas 12',
    content: 'Aplikasi ini sangat membantu saya menghemat waktu istirahat. Tidak perlu lagi mengantri lama di kantin!',
    rating: 5,
    imageUrl: '/images/user1.jpg',
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    role: 'Guru Matematika',
    content: 'Sangat praktis untuk memesan makanan disela-sela jadwal mengajar yang padat. Makanannya juga selalu enak.',
    rating: 4,
    imageUrl: '/images/user2.jpg',
  },
  {
    id: '3',
    name: 'Dimas Prayogo',
    role: 'Siswa Kelas 10',
    content: 'Fitur diskon yang diberikan sangat menguntungkan untuk kantong pelajar seperti saya. Top!',
    rating: 5,
    imageUrl: '/images/user3.jpg',
  },
];

// Features data
const features = [
  {
    icon: <FaSearch className="h-8 w-8 text-primary-600" />,
    title: 'Pencarian Mudah',
    description: 'Temukan menu favorit kamu dengan cepat dan mudah melalui fitur pencarian yang intuitif.',
  },
  {
    icon: <FaUtensils className="h-8 w-8 text-primary-600" />,
    title: 'Menu Bervariasi',
    description: 'Pilihan menu yang bervariasi dan selalu update setiap harinya.',
  },
  {
    icon: <FaClock className="h-8 w-8 text-primary-600" />,
    title: 'Efisien Waktu',
    description: 'Hemat waktu istirahatmu dengan memesan terlebih dahulu melalui aplikasi.',
  },
  {
    icon: <FaShoppingBag className="h-8 w-8 text-primary-600" />,
    title: 'Tracking Pesanan',
    description: 'Pantau status pesananmu secara real-time hingga makanan siap diambil.',
  },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Reusable animated section component
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const AnimatedSection = ({ children, className, id }: AnimatedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.section
      id={id}
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={controls}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function Home() {
  const [popularFoods, setPopularFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPopularFoods();
  }, []);

  const fetchPopularFoods = async () => {
    try {
      setIsLoading(true);
      const foods = await foodService.getAll();
      // Ambil 4 makanan terbaru
      setPopularFoods(foods.slice(0, 4));
    } catch (error) {
      console.error('Error fetching popular foods:', error);
      toast.error('Gagal memuat menu populer');
      // Tetap set array kosong jika terjadi error
      setPopularFoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (foodId: number) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    try {
      await cartService.create({
        food_id: foodId,
        quantity: 1
      });
      toast.success('Berhasil menambahkan ke keranjang');
    } catch (error: unknown) {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const message = errorObj.response?.data?.message || 'Gagal menambahkan ke keranjang';
      toast.error(message);
    }
  };

  return (
    <main className="overflow-x-hidden">
      <Header />
      
      {/* Redesigned Hero Section */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-white to-primary-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              className="lg:col-span-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-primary-100 text-primary-700 text-sm font-medium px-3 py-1 rounded-full inline-block mb-6">
                #MakanEnak #KantinHemat
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                Pesan Makanan <span className="text-primary-600">Tanpa Antri</span>
              </h1>
              <p className="mt-6 text-secondary-600 text-lg max-w-lg">
                Nikmati kemudahan memesan makanan di kantin sekolah. Cukup pesan lewat aplikasi dan ambil pesananmu saat sudah siap!
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/menu">
                  <Button size="lg" variant="primary" className="shadow-lg shadow-primary-200">
                    Lihat Menu
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="border-2 border-primary-600 text-primary-600 hover:bg-primary-50">
                    Daftar Sekarang
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="w-8 h-8 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-600">{item}</span>
                    </div>
                  ))}
                </div>
                <span className="ml-4 text-secondary-600">
                  <strong>200+</strong> pengguna aktif
                </span>
              </div>
            </motion.div>
            
            <motion.div
              className="lg:col-span-6 relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative h-[400px] w-full">
                <div className="absolute top-0 right-0 w-[95%] h-full">
                  <div className="relative h-full w-full rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src="/images/hero-banner.jpg"
                      alt="Koleksi makanan kantin"
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-4 bg-white p-4 rounded-lg shadow-lg w-48">
                  <div className="flex items-center">
                    <div className="p-2 bg-primary-100 rounded-lg mr-3">
                      <FaClock className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500">Pengiriman cepat</p>
                      <p className="font-bold text-secondary-800">5-10 menit</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <AnimatedSection className="py-20 bg-white" id="features">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900">Mengapa Menggunakan KantinKu?</h2>
            <p className="mt-4 text-secondary-600 max-w-3xl mx-auto">
              Aplikasi kantin online yang dirancang khusus untuk memenuhi kebutuhan siswa dan staff sekolah
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="p-6 border border-secondary-100 rounded-lg hover:shadow-xl transition-all duration-300 bg-white hover:border-primary-200"
              >
                <div className="mb-4 p-3 bg-primary-50 rounded-lg inline-block">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-secondary-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Popular Menu Section */}
      <AnimatedSection className="py-20 bg-secondary-50" id="popular-menu">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900">Menu Populer</h2>
              <p className="mt-2 text-secondary-600">
                Menu favorit pilihan banyak siswa dan guru
              </p>
            </div>
            <Link href="/menu">
              <Button variant="primary">Lihat Semua Menu</Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : popularFoods.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {popularFoods.map((food) => (
                <motion.div key={food.id} variants={fadeInUp}>
                  <FoodCard
                    id={food.id}
                    name={food.name}
                    price={food.price}
                    description={food.description || ''}
                    imageUrl={food.image || '/images/food-default.jpg'}
                    originalPrice={food.is_discount ? food.price : undefined}
                    discountPrice={food.is_discount ? food.discount_price : undefined}
                    onAddToCart={() => handleAddToCart(food.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-secondary-600">Tidak ada menu yang tersedia</p>
            </div>
          )}
        </div>
      </AnimatedSection>
      
      {/* How It Works Section */}
      <AnimatedSection className="py-20 bg-white" id="how-it-works">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900">Cara Kerja KantinKu</h2>
            <p className="mt-4 text-secondary-600 max-w-3xl mx-auto">
              Proses pemesanan yang mudah dan cepat, hanya dalam beberapa langkah sederhana
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              { step: 1, title: "Pilih Menu", description: "Pilih makanan dan minuman favoritmu dari berbagai pilihan menu yang tersedia" },
              { step: 2, title: "Pesan & Bayar", description: "Tambahkan ke keranjang, konfirmasi pesanan, dan lakukan pembayaran secara langsung" },
              { step: 3, title: "Ambil Pesanan", description: "Dapatkan notifikasi saat pesananmu siap dan ambil tanpa perlu mengantri" }
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="text-center relative">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-600 mb-6 shadow-md">
                  <span className="text-3xl font-bold">{item.step}</span>
                </div>
                {item.step < 3 && <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-primary-200" />}
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-secondary-600 max-w-xs mx-auto">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* Testimonials Section */}
      <AnimatedSection className="py-20 bg-secondary-50" id="testimonials">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900">Apa Kata Mereka?</h2>
            <p className="mt-4 text-secondary-600 max-w-3xl mx-auto">
              Pengalaman dari para pengguna KantinKu
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeInUp}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400'
                            : 'text-secondary-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-secondary-700 mb-6">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full overflow-hidden relative w-12 h-12 bg-primary-100">
                      <div className="absolute inset-0 flex items-center justify-center text-primary-600 font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-secondary-600">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>
      
      {/* CTA Section */}
      <AnimatedSection className="py-20 bg-gradient-to-br from-primary-600 to-primary-700" id="cta">
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Siap Mencoba KantinKu?
            </h2>
            <p className="text-white/90 max-w-3xl mx-auto mb-10 text-lg">
              Daftar sekarang dan nikmati kemudahan memesan makanan dan minuman di kantin sekolahmu!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="primary" className="bg-white text-primary-600 hover:bg-secondary-100 shadow-lg">
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
      
      <Footer />
    </main>
  );
}