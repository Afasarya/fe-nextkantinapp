"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser, } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
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
  // No longer needed since we removed the menu state
  useEffect(() => {
    // Mobile menu handling removed
  }, [pathname]);
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
        <Link href="/admin" className="flex items-center">
          <div className="relative h-10 w-10 mr-2">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
              K
            </div>
          </div>
          <span className="text-xl font-bold text-primary-600">Kantin<span className="text-secondary-800">Ku</span></span>
        </Link>

        {/* Admin User Profile - Optional */}
        <Link href="/admin/profile" className="p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors">
          <FaUser size={20} />
        </Link>
      </div>
    </header>
  );
};

export default Header;