import { PricingStrategyFactory } from './productPricing/PricingStrategyFactory';
import type { ICheckoutService } from './ICheckoutService';
import type { IProductConfigurationRepository } from '../repositories/IProductConfigurationRepository';
import type { IProductRepository } from '../repositories/IProductRepository';
import type { Product } from './../models/Product';
import type { ProductConfiguration } from '../models/ProductConfiguration';
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
        if (pricingConfig.strategy === 'quantity') {
          discountAmount += PricingStrategyFactory().getTotalDiscount(items, pricingConfig);
        }
        if (pricingConfig.strategy === 'bulk') {
          discountAmount += this.calculateBulkDiscount(items, pricingConfig);
        }
      }
    });

    return discountAmount;
  }

  private calculateBulkDiscount(items: Product[], pricingConfig: ProductConfiguration): number {
    if (items.length >= pricingConfig.config.quantityThreshold) {
      return items.length * Number(pricingConfig.config.discountedPrice);
    }

    return 0;
  }
}
