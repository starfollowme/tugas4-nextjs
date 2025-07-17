'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12"y1="17" x2="12.01" y2="17" />
    </svg>
);

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  category: string;
}

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  }, []);
  
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal mengambil data produk.');
      }
      
      setProducts(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal.';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showToast('Nama dan harga wajib diisi', 'error');
      return;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      showToast('Harga harus berupa angka positif', 'error');
      return;
    }

    const isEditing = !!editingProduct;
    const url = '/api/products';
    const method = isEditing ? 'PUT' : 'POST';
    
    const productData = {
        name: formData.name,
        price: price,
        description: formData.description,
        category: formData.category,
        ...(isEditing && { id: editingProduct.id }),
    };

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || `Gagal ${isEditing ? 'memperbarui' : 'menambah'} produk.`);
        }

        showToast(result.message, 'success');
        fetchProducts();
        closeModal();
    } catch(err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal.';
        showToast(errorMessage, 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deletingProductId) return;
    
    try {
        const response = await fetch(`/api/products?id=${deletingProductId}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Gagal menghapus produk.');
        }

        showToast(result.message, 'success');
        fetchProducts();
        closeDeleteModal();
    } catch(err) {
        const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal.';
        showToast(errorMessage, 'error');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description || '',
      category: product.category || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setDeletingProductId(id);
    setIsDeleteModalOpen(true);
  };
  
  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', category: '' });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProductId(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            className="w-16 h-16 border-4 border-dashed rounded-full border-sky-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <p className="text-xl font-semibold">Memuat Produk...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-5 right-5 z-[100] w-full max-w-xs space-y-3">
        <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.3 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className={`relative flex items-center justify-between w-full p-4 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
              >
                {toast.message}
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-sky-400">Dasbor Produk</h1>
              <p className="text-slate-400 mt-1">Kelola inventaris Anda dengan mudah dan bergaya.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal}
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-sky-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-sky-500/30"
            >
              <PlusIcon />
              Tambah Produk
            </motion.button>
          </header>

          <div className="bg-slate-800/50 rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="p-4 text-sm font-semibold text-slate-300">Nama</th>
                    <th className="p-4 text-sm font-semibold text-slate-300">Kategori</th>
                    <th className="p-4 text-sm font-semibold text-slate-300">Harga</th>
                    <th className="p-4 text-sm font-semibold text-slate-300 hidden md:table-cell">Deskripsi</th>
                    <th className="p-4 text-sm font-semibold text-slate-300 text-center">Aksi</th>
                  </tr>
                </thead>
                <motion.tbody layout className="divide-y divide-slate-700">
                  <AnimatePresence>
                  {products.map((product) => (
                    <motion.tr 
                        layout
                        key={product.id} 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className="hover:bg-slate-700/50 transition-colors duration-200"
                    >
                      <td className="p-4 font-medium">{product.name}</td>
                      <td className="p-4 text-slate-400">
                        <span className="bg-slate-700 text-sky-300 text-xs font-medium px-2.5 py-1 rounded-full">{product.category}</span>
                      </td>
                      <td className="p-4 font-mono text-emerald-400">{formatPrice(product.price)}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate hidden md:table-cell">{product.description}</td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={() => handleEdit(product)} className="p-2 rounded-md bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40 transition-colors"><EditIcon /></motion.button>
                          <motion.button whileHover={{scale: 1.1}} whileTap={{scale:0.9}} onClick={() => handleDelete(product.id)} className="p-2 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-colors"><DeleteIcon /></motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
              {products.length === 0 && !loading && (
                <div className="text-center py-16 text-slate-500">
                  <h3 className="text-xl font-semibold">Tidak ada produk ditemukan</h3>
                  <p>Klik "Tambah Produk" untuk memulai!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence onExitComplete={() => {
          resetForm();
          setDeletingProductId(null);
      }}>
        {isModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={closeModal}
            >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6 text-sky-400">{editingProduct ? 'Ubah Produk' : 'Tambah Produk Baru'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Nama Produk *</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-900/50 px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Harga (IDR) *</label>
                            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full bg-slate-900/50 px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition" min="0" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Kategori</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-900/50 px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition">
                                <option value="">Pilih Kategori</option>
                                <option value="Elektronik">Elektronik</option>
                                <option value="Pakaian">Pakaian</option>
                                <option value="Buku">Buku</option>
                                <option value="Rumah Tangga">Rumah Tangga</option>
                                <option value="Olahraga">Olahraga</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Deskripsi</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-900/50 px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 transition" rows={3}></textarea>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={closeModal} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-md transition-colors duration-300">Batal</button>
                            <button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition-colors duration-300">{editingProduct ? 'Perbarui Produk' : 'Tambah Produk'}</button>
                        </div>
                    </form>
                </div>
            </motion.div>
            </motion.div>
        )}

        {isDeleteModalOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                onClick={closeDeleteModal}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm border border-slate-700 p-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                        <AlertTriangleIcon />
                    </div>
                    <h3 className="text-xl font-bold text-white">Hapus Produk</h3>
                    <p className="text-slate-400 mt-2">Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.</p>
                    <div className="flex gap-3 mt-6">
                        <button onClick={closeDeleteModal} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-md transition-colors duration-300">Batal</button>
                        <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300">Hapus</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
