import type { IPricingStrategy } from './IPricingStrategy';
import type { Product } from '../../models/Product';
import type { ProductConfiguration } from '../../models/ProductConfiguration';
export class PricingService {
  public constructor(private readonly strategies: IPricingStrategy[]) {}

  public getTotalDiscount(products: Product[], config: ProductConfiguration): number {
    const handler = this.strategies.find((strategy) => config.strategy === strategy.getName());
    if (handler == null) {
      throw new Error(`No pricing strategy found for ${config.strategy}`);
    }

    return handler.calculateDiscount(products, config);
  }
}
