import type { ICheckoutService } from './ICheckoutService';
import type { Product } from './../models/Product';

export class CheckoutService implements ICheckoutService {
  public items: Product[] = [];

  public scan(_item: Product): void {
    this.items = [...this.items, _item];
  }

  public total(): number {
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }
}
