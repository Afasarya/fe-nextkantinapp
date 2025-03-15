import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers, FaUtensils, FaTrophy, FaThumbsUp, FaCheckCircle } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

const AboutPage = () => {
  // Team members
  const teamMembers = [
    {
      name: 'Ahmad Rasyid',
      role: 'Founder & CEO',
      image: '/images/team/team1.jpg',
      placeholder: 'AR',
    },
    {
      name: 'Siti Rahayu',
      role: 'Head of Operations',
      image: '/images/team/team2.jpg',
      placeholder: 'SR',
    },
    {
      name: 'Budi Santoso',
      role: 'Lead Developer',
      image: '/images/team/team3.jpg',
      placeholder: 'BS',
    },
    {
      name: 'Maya Wijaya',
      role: 'Marketing Manager',
      image: '/images/team/team4.jpg',
      placeholder: 'MW',
    },
  ];

  // Values
  const values = [
    {
      icon: <FaUtensils className="h-10 w-10 text-primary-600" />,
      title: 'Kualitas Makanan',
      description:
        'Kami memastikan semua makanan dan minuman yang tersedia memiliki kualitas terbaik dan memenuhi standar kesehatan.',
    },
    {
      icon: <FaUsers className="h-10 w-10 text-primary-600" />,
      title: 'Kepuasan Pelanggan',
      description:
        'Kepuasan pelanggan adalah prioritas utama kami. Kami selalu berusaha memberikan pengalaman terbaik bagi setiap pengguna.',
    },
    {
      icon: <FaTrophy className="h-10 w-10 text-primary-600" />,
      title: 'Inovasi',
      description:
        'Kami terus berinovasi untuk meningkatkan layanan dan menciptakan solusi yang lebih baik untuk kebutuhan kantin sekolah.',
    },
    {
      icon: <FaThumbsUp className="h-10 w-10 text-primary-600" />,
      title: 'Kemudahan',
      description:
        'Kami menciptakan platform yang mudah digunakan dan diakses oleh semua kalangan, dari siswa hingga staff sekolah.',
    },
  ];

  // Milestones
  const milestones = [
    {
      year: '2020',
      title: 'Awal Mula',
      description: 'KantinKu didirikan dengan visi merevolusi layanan kantin sekolah.',
    },
    {
      year: '2021',
      title: 'Peluncuran Beta',
      description: 'Versi beta diluncurkan di 3 sekolah percontohan dengan respons positif.',
    },
    {
      year: '2022',
      title: 'Ekspansi',
      description: 'KantinKu mulai digunakan di 15 sekolah di seluruh Indonesia.',
    },
    {
      year: '2023',
      title: 'Pembaruan Besar',
      description: 'Peluncuran versi 2.0 dengan fitur-fitur baru dan peningkatan keamanan.',
    },
    {
      year: '2024',
      title: 'Pertumbuhan Berkelanjutan',
      description: 'Ekspansi ke lebih dari 50 sekolah dengan lebih dari 20,000 pengguna aktif.',
    },
  ];

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 lg:pt-24 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang KantinKu</h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Solusi inovatif untuk memodernisasi layanan kantin sekolah dengan teknologi digital
              yang efisien dan user-friendly.
            </p>
          </div>
        </div>
        <div className="h-16 bg-white rounded-t-[50px] -mb-1"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Cerita Kami</h2>
              <p className="text-secondary-600 mb-4">
                KantinKu berawal dari pengalaman pribadi kami menghadapi masalah antrian panjang
                di kantin sekolah, waktu istirahat yang terbuang, dan kesulitan memesan makanan.
              </p>
              <p className="text-secondary-600 mb-4">
                Didirikan pada tahun 2020, KantinKu lahir dengan misi sederhana: membuat proses
                pemesanan makanan di kantin sekolah menjadi lebih efisien, nyaman, dan
                menyenangkan.
              </p>
              <p className="text-secondary-600 mb-4">
                Kami percaya teknologi dapat membantu menyederhanakan proses pemesanan makanan
                tanpa mengorbankan kualitas dan kehangatan interaksi sosial di lingkungan
                sekolah.
              </p>
              <p className="text-secondary-600">
                Saat ini, KantinKu telah digunakan di puluhan sekolah di seluruh Indonesia dan
                terus berkembang untuk memberikan pengalaman terbaik bagi pengguna kami.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/about-hero.jpg"
                alt="Tentang KantinKu"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">Nilai-Nilai Kami</h2>
            <p className="text-lg text-secondary-600">
              Kami membangun KantinKu berdasarkan nilai-nilai yang menjadi landasan kami dalam
              memberikan layanan terbaik untuk pengguna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm border border-secondary-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-3">{value.title}</h3>
                <p className="text-secondary-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">Perjalanan Kami</h2>
            <p className="text-lg text-secondary-600">
              Melihat kembali perjalanan kami dari awal hingga saat ini dan pencapaian penting
              yang telah kami raih bersama.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200"></div>

            {/* Timeline Items */}
            <div className="relative">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`mb-12 flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-full md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                    }`}
                  >
                    <span className="text-primary-600 font-bold text-xl">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-semibold mt-1 mb-2">{milestone.title}</h3>
                    <p className="text-secondary-600">{milestone.description}</p>
                  </div>
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    {milestone.year.slice(2)}
                  </div>
                  <div className="w-full md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6">Tim Kami</h2>
            <p className="text-lg text-secondary-600">
              Kenali orang-orang hebat di balik KantinKu yang bekerja keras untuk memberikan
              pengalaman terbaik bagi pengguna.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-64 bg-primary-100">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary-100 text-primary-600 text-4xl font-bold">
                      {member.placeholder}
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-secondary-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Kenapa Memilih KantinKu?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-primary-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Hemat Waktu</h3>
                    <p className="text-secondary-600">
                      Pesan makanan sebelum jam istirahat dan ambil pesanan tanpa perlu mengantri.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-primary-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Menu Bervariasi</h3>
                    <p className="text-secondary-600">
                      Pilih dari berbagai menu yang tersedia dan berbagai kategori makanan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-primary-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Tracking Pesanan</h3>
                    <p className="text-secondary-600">
                      Pantau status pesanan secara real-time dan dapatkan notifikasi saat pesanan siap.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FaCheckCircle className="text-primary-600 h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Promo & Diskon</h3>
                    <p className="text-secondary-600">
                      Nikmati berbagai promo dan diskon menarik untuk pengguna setia KantinKu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/feature1.jpg"
                  alt="Feature 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden shadow-md mt-8">
                <Image
                  src="/images/feature2.jpg"
                  alt="Feature 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/feature3.jpg"
                  alt="Feature 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden shadow-md mt-8">
                <Image
                  src="/images/feature4.jpg"
                  alt="Feature 4"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Menggunakan KantinKu?
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Bergabunglah dengan ribuan siswa dan staff sekolah yang sudah merasakan manfaat
              menggunakan KantinKu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="primary"
                  className="bg-white text-primary-600 hover:bg-secondary-100"
                >
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;