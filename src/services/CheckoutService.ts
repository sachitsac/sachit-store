import type { ICheckoutService } from './ICheckoutService';
import type { IProductRepository } from '../repositories/IProductRepository';
import type { Product } from './../models/Product';

export class CheckoutService implements ICheckoutService {
  public items: Product[] = [];

  public constructor(private readonly productRepo: IProductRepository) {}

  public scan(sku: Product['sku']): void {
    const product = this.productRepo.findProductBySku(sku);
    this.items = [...this.items, product];
  }

  public total(): number {
    if (this.items.length === 0) {
      return 0;
    }
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }
}
