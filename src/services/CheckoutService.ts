import { PricingStrategyFactory } from './productPricing/PricingStrategyFactory';
import type { ICheckoutService } from './ICheckoutService';
import type { IProductConfigurationRepository } from '../repositories/IProductConfigurationRepository';
import type { IProductRepository } from '../repositories/IProductRepository';
import type { Product } from './../models/Product';
import { groupBy } from '../utils/groupBy';

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
    const itemsBySku = groupBy(this.items, (item) => item.sku);

    let discountAmount = 0;
    itemsBySku.forEach((items) => {
      const pricingConfig = this.productConficurationRepository.findBySku(items[0].sku);
      if (pricingConfig != null) {
        discountAmount += PricingStrategyFactory().getTotalDiscount(items, pricingConfig);
      }
    });

    return discountAmount;
  }
}
