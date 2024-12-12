import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProduct } from './DTOs/create-product.dto';
import { UpdateProduct } from './DTOs/update-product.dto';

@Injectable()
export class ProductsService {
  private products = {
    ka: [
      {
        id: 1,
        name: 'ჭიქა',
        price: '100',
        category: 'სამზარეულო',
        cteatedAt: 'today',
      },
      {
        id: 2,
        name: 'პური',
        price: '1',
        category: 'საჭმელი',
        cteatedAt: 'yesterday',
      },
    ],
    en: [
      {
        id: 1,
        name: 'cup',
        price: '100',
        category: 'kitchen',
        cteatedAt: 'today',
      },
      {
        id: 2,
        name: 'bread',
        price: '1',
        category: 'food',
        cteatedAt: 'yesterday',
      },
    ],
  };

  getAllProducts(productFilters: UpdateProduct, lang: 'ka' | 'en') {
    let filteredProducts = this.products[lang];

    if (productFilters.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === productFilters.category,
      );
    }
    if (productFilters.price) {
      filteredProducts = filteredProducts.filter(
        (product) => parseInt(product.price) > parseInt(productFilters.price),
      );
    }
    return filteredProducts;
  }

  getProductById(id: number, lang: 'ka' | 'en') {
    const product = this.products[lang].find((el) => el.id === id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  createProduct(body: CreateProduct, lang: 'ka' | 'en') {
    if (!body.category || !body.name || !body.price) {
      throw new HttpException('Fields are required', HttpStatus.BAD_REQUEST);
    }

    const lastId = this.products[lang][this.products[lang].length - 1]?.id || 0;
    const newProduct = {
      id: lastId + 1,
      name: body.name,
      price: body.price,
      category: body.category,
      cteatedAt: new Date().toISOString(),
    };

    this.products.ka.push(newProduct);
    this.products.en.push(newProduct);
    return newProduct;
  }

  deleteProduct(id: number, lang: 'ka' | 'en') {
    const index = this.products[lang].findIndex((el) => el.id === id);
    if (index === -1) {
      throw new HttpException('Product ID is invalid', HttpStatus.BAD_REQUEST);
    }

    const deletedProductKa = this.products.ka.splice(index, 1);
    const deletedProductEn = this.products.en.splice(index, 1);

    return { ka: deletedProductKa, en: deletedProductEn };
  }

  updateProduct(id: number, body: UpdateProduct, lang: 'ka' | 'en') {
    const index = this.products[lang].findIndex((el) => el.id === id);
    if (index === -1) {
      throw new HttpException('Product ID is invalid', HttpStatus.BAD_REQUEST);
    }

    const updatedProduct = {
      ...this.products[lang][index],
      ...body,
    };

    this.products.ka[index] = updatedProduct;
    this.products.en[index] = updatedProduct;

    return updatedProduct;
  }
}
