import type { ICheckoutService } from './ICheckoutService';
import type { IProductConfigurationRepository } from '../repositories/IProductConfigurationRepository';
import type { IProductRepository } from '../repositories/IProductRepository';
import type { Product } from './../models/Product';
import type { ProductConfiguration } from '../models/ProductConfiguration';

export class CheckoutService implements ICheckoutService {
  public items: Product[] = [];

  public constructor(
    private readonly productRepo: IProductRepository,
    private readonly productConficurationRepository: IProductConfigurationRepository,
  ) {}

  public scan(sku: Product['sku']): void {
    const product = this.productRepo.findProductBySku(sku);
    this.items = [...this.items, product];
  }

  public total(): number {
    if (this.items.length === 0) {
      return 0;
    }
    const normalPriceTotal = this.items.reduce((acc, item) => acc + item.price, 0);
    return normalPriceTotal - this.calculateDiscounts();
  }

  private calculateDiscounts(): number {
    const itemsBySku = this.groupBy(this.items, (item) => item.sku);

    let discountAmount = 0;
    itemsBySku.forEach((items) => {
      const pricingConfig = this.productConficurationRepository.findBySku(items[0].sku);
      if (pricingConfig != null) {
        if (pricingConfig.strategy === 'quantity') {
          discountAmount += this.calculateQuantityDiscount(items, pricingConfig);
        }
      }
    });

    return discountAmount;
  }
  private calculateQuantityDiscount(items: Product[], pricingConfig: ProductConfiguration): number {
    const quantity = items.length;
    const discount = Math.floor(quantity / Number(pricingConfig.config.quantityThreshold));
    return discount > 0 ? discount * Number(pricingConfig.config.discountedPrice) : 0;
  }

  private groupBy<K, V>(array: V[], keyFn: (item: V) => K): Map<K, V[]> {
    return array.reduce((store, item) => {
      const key = keyFn(item);
      if (!store.has(key)) {
        store.set(key, [item]);
      } else {
        store.get(key)?.push(item);
      }
      return store;
    }, new Map<K, V[]>());
  }
}
