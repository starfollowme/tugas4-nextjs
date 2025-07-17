import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  sku?: string;
  stock?: number;
}

const products: Product[] = [
    { id: 1, name: 'Laptop Pro', sku: 'LP-001', price: 15000000, stock: 50, description: 'Laptop bertenaga tinggi untuk para profesional.', category: 'Elektronik' },
    { id: 2, name: 'Mouse Nirkabel', sku: 'MN-002', price: 250000, stock: 120, description: 'Mouse ergonomis dengan konektivitas nirkabel.', category: 'Aksesoris Komputer' },
    { id: 3, name: 'Keyboard Mekanikal', sku: 'KM-003', price: 850000, stock: 75, description: 'Keyboard dengan switch mekanikal untuk pengalaman mengetik terbaik.', category: 'Aksesoris Komputer' },
];

let nextId = 4;

const validateProduct = (product: Partial<Product>) => {
  if (product.name !== undefined && (typeof product.name !== 'string' || product.name.trim() === '')) {
    return 'Validasi gagal: "name" harus berupa string yang tidak kosong.';
  }
  if (product.price !== undefined && (typeof product.price !== 'number' || product.price <= 0)) {
    return 'Validasi gagal: "price" harus berupa angka positif.';
  }
  return null;
};


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        return NextResponse.json({
          success: false,
          message: 'ID Produk tidak valid. ID harus berupa angka.'
        }, { status: 400 });
      }

      const product = products.find(p => p.id === productId);

      if (product) {
        return NextResponse.json({
          success: true,
          data: product,
          message: 'Produk berhasil diambil'
        });
      } else {
        return NextResponse.json({
          success: false,
          message: `Produk dengan ID ${productId} tidak ditemukan.`
        }, { status: 404 });
      }
    }

    return NextResponse.json({
      success: true,
      data: products,
      message: 'Semua produk berhasil diambil'
    });
  } catch (error) {
    console.error('[API_PRODUCTS_GET_ERROR]', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server internal saat mengambil produk.'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.name === undefined || body.price === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Validasi gagal: "name" dan "price" adalah bidang yang wajib diisi.'
      }, { status: 400 });
    }

    const validationError = validateProduct(body);
    if (validationError) {
        return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const newProduct: Product = {
      id: nextId++,
      name: body.name,
      price: body.price,
      description: body.description || '',
      category: body.category || 'Umum',
      sku: body.sku || '',
      stock: body.stock || 0,
    };

    products.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Produk berhasil dibuat'
    }, { status: 201 });
  } catch (error) {
    console.error('[API_PRODUCTS_POST_ERROR]', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({
          success: false,
          message: 'Gagal membuat produk: Format JSON tidak valid pada body permintaan.'
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server internal saat membuat produk.'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({
        success: false,
        message: 'Validasi gagal: "id" wajib ada di body permintaan untuk pembaruan.'
      }, { status: 400 });
    }

    const productIndex = products.findIndex(p => p.id === body.id);
    
    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        message: `Produk dengan ID ${body.id} tidak ditemukan.`
      }, { status: 404 });
    }

    const validationError = validateProduct(body);
    if (validationError) {
        return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    const originalProduct = products[productIndex];

    const updatedProduct: Product = {
      ...originalProduct,
      ...body,
    };

    products[productIndex] = updatedProduct;

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Produk berhasil diperbarui'
    });
  } catch (error) {
    console.error('[API_PRODUCTS_PUT_ERROR]', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({
          success: false,
          message: 'Gagal memperbarui produk: Format JSON tidak valid pada body permintaan.'
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server internal saat memperbarui produk.'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'ID Produk diperlukan sebagai parameter kueri untuk penghapusan.'
      }, { status: 400 });
    }

    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
        return NextResponse.json({
            success: false,
            message: 'ID Produk tidak valid. ID harus berupa angka.'
        }, { status: 400 });
    }

    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        message: `Produk dengan ID ${productId} tidak ditemukan.`
      }, { status: 404 });
    }

    const [deletedProduct] = products.splice(productIndex, 1);

    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'Produk berhasil dihapus'
    });
  } catch (error) {
    console.error('[API_PRODUCTS_DELETE_ERROR]', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server internal saat menghapus produk.'
    }, { status: 500 });
  }
}
