import type { Product } from '../models/Product';

export interface IProductRepository {
  findProductBySku: (sku: Product['sku']) => Product;
}
