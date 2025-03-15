'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaShoppingCart, FaCreditCard, FaMoneyBill } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartItem from '@/components/user/CartItem';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

// Sample cart data
const initialCartItems = [
  {
    id: '1',
    name: 'Nasi Goreng Spesial',
    price: 15000,
    quantity: 2,
    imageUrl: '/images/food-items/item1.jpg',
    notes: 'Pedas level 2, tambah telur',
  },
  {
    id: '2',
    name: 'Es Teh Manis',
    price: 5000,
    quantity: 2,
    imageUrl: '/images/food-items/item3.jpg',
    notes: '',
  },
  {
    id: '3',
    name: 'Ayam Penyet',
    price: 18000,
    quantity: 1,
    imageUrl: '/images/food-items/item4.jpg',
    notes: 'Sambal terpisah',
  },
];

// Sample promo codes
const availablePromoCodes = [
  { code: 'DISKON10', discount: 0.1, maxDiscount: 10000, minOrder: 20000 },
  { code: 'WELCOME20', discount: 0.2, maxDiscount: 15000, minOrder: 30000 },
];

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof availablePromoCodes[0] | null>(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const serviceFee = 2000;
  const discount = appliedPromo
    ? Math.min(subtotal * appliedPromo.discount, appliedPromo.maxDiscount)
    : 0;
  const total = subtotal + serviceFee - discount;

  const handleIncrement = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id: string) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success('Item telah dihapus dari keranjang');
  };

  const handleNotesChange = (id: string, notes: string) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleApplyPromo = () => {
    // Reset previous promo
    setAppliedPromo(null);
    setPromoError('');

    if (!promoCode.trim()) {
      setPromoError('Masukkan kode promo');
      return;
    }

    // Check if promo code exists
    const promoFound = availablePromoCodes.find(
      (promo) => promo.code === promoCode.toUpperCase()
    );

    if (!promoFound) {
      setPromoError('Kode promo tidak valid');
      return;
    }

    // Check if minimum order is met
    if (subtotal < promoFound.minOrder) {
      setPromoError(
        `Minimal pembelian Rp ${promoFound.minOrder.toLocaleString('id-ID')} untuk promo ini`
      );
      return;
    }

    // Apply promo
    setAppliedPromo(promoFound);
    toast.success('Kode promo berhasil diterapkan!');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Keranjang Anda kosong');
      return;
    }

    setIsCheckingOut(true);

    // Simulate API call delay
    setTimeout(() => {
      toast.success('Pesanan berhasil dibuat!');
      router.push('/orders');
      setIsCheckingOut(false);
    }, 1500);
  };

  // Effect to reset applied promo when cart items change
  useEffect(() => {
    if (appliedPromo && subtotal < appliedPromo.minOrder) {
      setAppliedPromo(null);
      setPromoError('');
      toast.error('Promo dihapus karena tidak memenuhi syarat minimum pembelian');
    }
  }, [cartItems, appliedPromo, subtotal]);

  return (
    <main className="min-h-screen bg-secondary-50">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-6">
          <Link href="/menu" className="flex items-center text-primary-600 font-medium">
            <FaArrowLeft className="mr-2" />
            Kembali ke Menu
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FaShoppingCart className="mr-2 text-primary-600" />
                    <span>Daftar Item ({cartItems.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y divide-secondary-200">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        quantity={item.quantity}
                        imageUrl={item.imageUrl}
                        notes={item.notes}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                        onRemove={handleRemove}
                        onNotesChange={handleNotesChange}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Biaya Layanan</span>
                    <span className="font-medium">{formatCurrency(serviceFee)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Diskon ({appliedPromo.code})</span>
                      <span className="font-medium">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-secondary-200 pt-4 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary-600 text-lg">{formatCurrency(total)}</span>
                  </div>

                  {/* Promo Code Input */}
                  <div className="pt-4">
                    <p className="text-sm font-medium mb-2">Kode Promo</p>
                    <div className="flex">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Masukkan kode promo"
                        className="flex-1 p-2 border border-secondary-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors"
                      >
                        Terapkan
                      </button>
                    </div>
                    {promoError && <p className="text-sm text-red-600 mt-1">{promoError}</p>}
                    {appliedPromo && (
                      <p className="text-sm text-green-600 mt-1">
                        Promo {appliedPromo.code} berhasil diterapkan!
                      </p>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div className="pt-4">
                    <p className="text-sm font-medium mb-2">Metode Pembayaran</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`flex items-center justify-center p-3 border rounded-md ${
                          paymentMethod === 'cash'
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-secondary-300 text-secondary-700 hover:bg-secondary-50'
                        }`}
                      >
                        <FaMoneyBill className="mr-2" />
                        <span>Tunai</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`flex items-center justify-center p-3 border rounded-md ${
                          paymentMethod === 'card'
                            ? 'border-primary-600 bg-primary-50 text-primary-600'
                            : 'border-secondary-300 text-secondary-700 hover:bg-secondary-50'
                        }`}
                      >
                        <FaCreditCard className="mr-2" />
                        <span>Kartu</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleCheckout}
                    isLoading={isCheckingOut}
                  >
                    Pesan Sekarang
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <FaShoppingCart size={48} className="text-secondary-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Keranjang Anda Kosong</h2>
            <p className="text-secondary-600 mb-6">
              Anda belum menambahkan item apapun ke keranjang.
            </p>
            <Link href="/menu">
              <Button variant="primary">Lihat Menu</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default CartPage;