import './globals.css';
import { Quicksand } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Kantin Online - Pesan Makanan & Minuman Mudah',
  description: 'Website Kantin Online untuk pemesanan makanan dan minuman dengan mudah dan cepat',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={quicksand.variable}>
      <body className="font-sans">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}