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
import { cartService } from '@/services/cart';
import { Cart } from '@/types/cart';
import { authService } from '@/services/auth';

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any | null>(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const data = await cartService.getAll();
      setCartItems(data);
    } catch (error) {
      toast.error('Gagal memuat keranjang');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    try {
      const updatedCart = await cartService.update(id, {
        quantity: item.quantity + 1
      });
      setCartItems(cartItems.map((item) =>
        item.id === id ? updatedCart : item
      ));
    } catch (error) {
      toast.error('Gagal memperbarui jumlah item');
    }
  };

  const handleDecrement = async (id: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item || item.quantity <= 1) return;

    try {
      const updatedCart = await cartService.update(id, {
        quantity: item.quantity - 1
      });
      setCartItems(cartItems.map((item) =>
        item.id === id ? updatedCart : item
      ));
    } catch (error) {
      toast.error('Gagal memperbarui jumlah item');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await cartService.delete(id);
      setCartItems(cartItems.filter((item) => item.id !== id));
      toast.success('Item berhasil dihapus dari keranjang');
    } catch (error) {
      toast.error('Gagal menghapus item dari keranjang');
    }
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.food.price * item.quantity), 0);
  const serviceFee = 2000;
  const discount = appliedPromo
    ? Math.min(subtotal * appliedPromo.discount, appliedPromo.maxDiscount)
    : 0;
  const total = subtotal + serviceFee - discount;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-secondary-50">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

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
                  {/* <div className="divide-y divide-secondary-200">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        id={item.id}
                        name={item.food.name}
                        price={item.food.price}
                        quantity={item.quantity}
                        imageUrl={item.food.image}
                        onIncrement={() => handleIncrement(item.id)}
                        onDecrement={() => handleDecrement(item.id)}
                        onRemove={() => handleRemove(item.id)}
                      />
                    ))}
                  </div> */}
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
                    <span className="font-bold text-primary-600 text-lg">
                      {formatCurrency(total)}
                    </span>
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
                    onClick={() => {
                      toast.success('Fitur checkout akan segera hadir!');
                    }}
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