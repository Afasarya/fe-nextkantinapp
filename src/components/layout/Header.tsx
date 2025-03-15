"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  const isAdmin = pathname?.includes('/admin');
  const isAuth = pathname?.includes('/login') || pathname?.includes('/register');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Don't render header on auth pages
  if (isAuth) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-white py-4' /* Clean white background */
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-10 mr-2">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
              K
            </div>
          </div>
          <span className="text-xl font-bold text-primary-600">Kantin<span className="text-secondary-800">Ku</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {!isAdmin ? (
            <>
              <Link href="/" className={`px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/' ? 'text-primary-600' : 'text-secondary-700 hover:text-primary-600'}`}>
                Beranda
              </Link>
              <Link href="/menu" className={`px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/menu' ? 'text-primary-600' : 'text-secondary-700 hover:text-primary-600'}`}>
                Menu
              </Link>
              <Link href="/about" className={`px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/about' ? 'text-primary-600' : 'text-secondary-700 hover:text-primary-600'}`}>
                Tentang
              </Link>
              <Link href="/contact" className={`px-3 py-2 rounded-md font-medium transition-colors ${pathname === '/contact' ? 'text-primary-600' : 'text-secondary-700 hover:text-primary-600'}`}>
                Kontak
              </Link>
            </>
          ) : (
            <span className="font-semibold text-primary-600">Admin Dashboard</span>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {!isAdmin ? (
            <>
              <Link href="/cart" className="p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors relative">
                <FaShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  3
                </span>
              </Link>
              <Link href="/profile" className="p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
                <FaUser size={20} />
              </Link>
              <Link href="/login">
                <Button size="sm" variant="primary">Masuk</Button>
              </Link>
            </>
          ) : (
            <Link href="/profile" className="p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
              <FaUser size={20} />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={toggleMenu} aria-label="Toggle Menu">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-secondary-100 shadow-lg">
          <div className="container mx-auto px-6 py-3 max-w-7xl">
            <nav className="flex flex-col space-y-3 py-3">
              {!isAdmin ? (
                <>
                  <Link href="/" className={`px-3 py-2 rounded-md font-medium ${pathname === '/' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Beranda
                  </Link>
                  <Link href="/menu" className={`px-3 py-2 rounded-md font-medium ${pathname === '/menu' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Menu
                  </Link>
                  <Link href="/about" className={`px-3 py-2 rounded-md font-medium ${pathname === '/about' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Tentang
                  </Link>
                  <Link href="/contact" className={`px-3 py-2 rounded-md font-medium ${pathname === '/contact' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Kontak
                  </Link>
                  <div className="flex items-center space-x-3 py-2">
                    <Link href="/cart" className="p-2 rounded-full bg-primary-50 text-primary-600 relative">
                      <FaShoppingCart size={20} />
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        3
                      </span>
                    </Link>
                    <Link href="/profile" className="p-2 rounded-full bg-primary-50 text-primary-600">
                      <FaUser size={20} />
                    </Link>
                    <Link href="/login" className="flex-1">
                      <Button fullWidth>Masuk</Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-primary-600 mb-3">Admin Dashboard</div>
                  <Link href="/admin/dashboard" className={`px-3 py-2 rounded-md font-medium ${pathname === '/admin/dashboard' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Dashboard
                  </Link>
                  <Link href="/admin/products" className={`px-3 py-2 rounded-md font-medium ${pathname === '/admin/products' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Produk
                  </Link>
                  <Link href="/admin/orders" className={`px-3 py-2 rounded-md font-medium ${pathname === '/admin/orders' ? 'text-primary-600' : 'text-secondary-700'}`}>
                    Pesanan
                  </Link>
                  <Link href="/admin/profile" className="flex items-center py-2">
                    <div className="p-2 rounded-full bg-primary-50 text-primary-600 mr-2">
                      <FaUser size={20} />
                    </div>
                    <span>Profil</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;