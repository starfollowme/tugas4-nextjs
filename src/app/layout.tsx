import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const PackageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.2"></line>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

export const metadata = {
  title: 'Aplikasi Manajemen Produk',
  description: 'Aplikasi manajemen produk modern dengan operasi CRUD',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-900 text-slate-300 font-sans`}>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-50 bg-slate-800/70 backdrop-blur-md border-b border-slate-700 shadow-lg shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center gap-3">
                  <PackageIcon />
                  <h1 className="text-2xl font-bold text-sky-400">
                    Manajemen Produk
                  </h1>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <a href="/" className="text-slate-300 hover:text-sky-400 transition-colors duration-300">Beranda</a>
                  <a href="/products" className="text-slate-300 hover:text-sky-400 transition-colors duration-300">Produk</a>
                  <a href="/about" className="text-slate-300 hover:text-sky-400 transition-colors duration-300">Tentang</a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-slate-800/70 border-t border-slate-700 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} Sistem Manajemen Produk. Hak cipta dilindungi undang-undang.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
