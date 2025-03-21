"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaUtensils, 
  FaUsers, 
  FaShoppingBag, 
  FaPercent, 
  FaChartBar, 
  FaCog, 
  FaBars, 
  FaSignOutAlt 
} from 'react-icons/fa';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onClose }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <FaTachometerAlt />,
      href: '/dashboard',
    },
    {
      name: 'Produk',
      icon: <FaUtensils />,
      href: '/products',
    },
    {
      name: 'Pelanggan',
      icon: <FaUsers />,
      href: '/customers',
    },
    {
      name: 'Pesanan',
      icon: <FaShoppingBag />,
      href: '/orders',
    },
    {
      name: 'Diskon',
      icon: <FaPercent />,
      href: '/discounts',
    },
    {
      name: 'Laporan',
      icon: <FaChartBar />,
      href: '/reports',
    },
    {
      name: 'Stand',
      icon: <FaChartBar />,
      href: '/stand',
    },
    {
      name: 'Pengaturan',
      icon: <FaCog />,
      href: '/settings',
    },
  ];

  const handleNavigation = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarClasses = isMobile
    ? 'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out'
    : `fixed inset-y-0 left-0 z-30 bg-white shadow-xl transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`;

  const menuItemClassActive = "flex items-center py-3 px-4 text-primary-600 bg-primary-50 rounded-md my-1 transition-all duration-200";
  const menuItemClass = "flex items-center py-3 px-4 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 rounded-md my-1 transition-all duration-200";

  return (
    <div className={sidebarClasses}>
      {!isMobile && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-20 bg-white border border-secondary-200 rounded-full p-1 text-secondary-500 hover:text-primary-600 transition-colors shadow-md"
        >
          <FaBars size={16} />
        </button>
      )}
      
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center h-16 border-b border-secondary-100">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl mr-2">
              K
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-primary-600">Admin<span className="text-secondary-800">Panel</span></span>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-grow overflow-y-auto pt-5 px-3">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? menuItemClassActive : menuItemClass}
                  onClick={handleNavigation}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {(!isCollapsed || isMobile) && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-secondary-100 p-3">
          <button className={`${menuItemClass} w-full justify-center sm:justify-start`}>
            <span className="text-lg mr-3 text-red-500">
              <FaSignOutAlt />
            </span>
            {(!isCollapsed || isMobile) && (
              <span className="text-sm font-medium text-red-500">Keluar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;