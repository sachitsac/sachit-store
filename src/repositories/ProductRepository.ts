import type { IProductRepository } from './IProductRepository';
import type { Product } from '../models/Product';
import { products } from '../data/products';

export class ProductRepository implements IProductRepository {
  public findProductBySku(sku: string): Product {
    const product = products().find((p) => p.sku === sku);
    if (product == null) {
      throw new Error(`Product with sku ${sku} not found`);
    }

    return product;
  }
}
