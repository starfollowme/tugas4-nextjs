import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg shadow-black/20 p-8 text-center border border-slate-700">
          <h1 className="text-4xl md:text-5xl font-bold text-sky-400 mb-4">
            Selamat Datang di Sistem Manajemen Produk
          </h1>
          <p className="text-lg text-slate-400 mb-10">
            Cara sederhana dan efisien untuk mengelola produk Anda dengan operasi CRUD penuh.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-10 text-left">
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
              <h3 className="text-xl font-semibold text-sky-300 mb-3">Fitur</h3>
              <ul className="text-slate-400 space-y-2 list-inside list-disc">
                <li>Tambah produk baru</li>
                <li>Lihat semua produk</li>
                <li>Ubah produk yang ada</li>
                <li>Hapus produk</li>
                <li>Desain responsif</li>
              </ul>
            </div>
            
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
              <h3 className="text-xl font-semibold text-emerald-300 mb-3">Tumpukan Teknologi</h3>
              <ul className="text-slate-400 space-y-2 list-inside list-disc">
                <li>Next.js 14 (App Router)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>REST API</li>
                <li>Penyimpanan Data Statis</li>
              </ul>
            </div>
          </div>
          
          <Link 
            href="/products"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-sky-400/30 transform hover:-translate-y-1"
          >
            Lihat Produk →
          </Link>
        </div>
      </div>
    </div>
  )
}
