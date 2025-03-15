"use client";
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const Footer: React.FC = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.includes('/admin');
  const isAuth = pathname?.includes('/login') || pathname?.includes('/register');

  // Don't render footer on auth pages
  if (isAuth) return null;

  // Simplified footer for admin pages
  if (isAdmin) {
    return (
      <footer className="bg-secondary-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} KantinKu - Admin Panel. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-secondary-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl mr-2">
                K
              </div>
              <span className="text-xl font-bold text-white">Kantin<span className="text-primary-600">Ku</span></span>
            </div>
            <p className="text-secondary-200 mb-4">
              Solusi praktis untuk memesan makanan dan minuman di kantin sekolah dengan cepat, mudah, dan efisien.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-500 transition-colors">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Link Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-secondary-200 hover:text-primary-500 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-secondary-200 hover:text-primary-500 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-secondary-200 hover:text-primary-500 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary-200 hover:text-primary-500 transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Kontak</h3>
            <ul className="space-y-2">
              <li className="text-secondary-200">
                <span className="block">Alamat:</span>
                <address className="not-italic">
                  Jl. Pendidikan No. 123<br />
                  Kota Jakarta, 12345
                </address>
              </li>
              <li className="text-secondary-200">
                <span>Email: kantinku@example.com</span>
              </li>
              <li className="text-secondary-200">
                <span>Telepon: (021) 1234-5678</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Jam Operasional</h3>
            <ul className="space-y-2">
              <li className="text-secondary-200">
                <span className="flex justify-between">
                  <span>Senin - Jumat:</span>
                  <span>07:00 - 16:00</span>
                </span>
              </li>
              <li className="text-secondary-200">
                <span className="flex justify-between">
                  <span>Sabtu:</span>
                  <span>08:00 - 14:00</span>
                </span>
              </li>
              <li className="text-secondary-200">
                <span className="flex justify-between">
                  <span>Minggu:</span>
                  <span>Tutup</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-700 mt-8 pt-6 text-center">
          <p className="text-secondary-300">
            &copy; {new Date().getFullYear()} KantinKu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;