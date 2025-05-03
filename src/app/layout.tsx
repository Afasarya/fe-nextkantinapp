import './globals.css';
import { Quicksand } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                fontSize: '16px',
                padding: '16px',
                maxWidth: '350px',
                textAlign: 'center'
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
                style: {
                  background: '#333',
                  color: '#fff',
                  borderLeft: '5px solid #10B981',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#333',
                  color: '#fff',
                  borderLeft: '5px solid #EF4444',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
