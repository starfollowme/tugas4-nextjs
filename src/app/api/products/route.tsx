import { NextRequest, NextResponse } from 'next/server';

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
}

let products: Product[] = [];

let nextId = 1;

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

    if (!body.name || body.price === undefined) {
      return NextResponse.json({
        success: false,
        message: 'Validasi gagal: "name" dan "price" adalah bidang yang wajib diisi.'
      }, { status: 400 });
    }

    if (typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json({
        success: false,
        message: 'Validasi gagal: "name" harus berupa string yang tidak kosong.'
      }, { status: 400 });
    }

    if (typeof body.price !== 'number' || body.price <= 0) {
      return NextResponse.json({
        success: false,
        message: 'Validasi gagal: "price" harus berupa angka positif.'
      }, { status: 400 });
    }

    const newProduct: Product = {
      id: nextId++,
      name: body.name,
      price: body.price,
      description: body.description || '',
      category: body.category || 'Umum'
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

    const originalProduct = products[productIndex];

    const updatedProduct: Product = {
      ...originalProduct,
      name: body.name || originalProduct.name,
      price: body.price || originalProduct.price,
      description: body.description !== undefined ? body.description : originalProduct.description,
      category: body.category !== undefined ? body.category : originalProduct.category
    };

    if (typeof updatedProduct.name !== 'string' || updatedProduct.name.trim() === '') {
        return NextResponse.json({ success: false, message: 'Validasi gagal: "name" harus berupa string yang tidak kosong.'}, { status: 400 });
    }
    if (typeof updatedProduct.price !== 'number' || updatedProduct.price <= 0) {
        return NextResponse.json({ success: false, message: 'Validasi gagal: "price" harus berupa angka positif.'}, { status: 400 });
    }

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
