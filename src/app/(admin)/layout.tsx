'use client';

import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Header from '@/components/layout/AdminHeader';
import Sidebar from '@/components/layout/Sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // To prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={closeMobileSidebar}
          ></div>
          <Sidebar isMobile onClose={closeMobileSidebar} />
        </>
      )}

      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed bottom-6 right-6 z-30 bg-primary-600 text-white rounded-full p-3 shadow-lg"
        aria-label="Toggle Menu"
      >
        {isMobileSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Main Content */}
      <div className="md:pl-64 pt-16">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>

      {/* Footer is not shown in admin layout */}
    </div>
  );
};

export default AdminLayout;