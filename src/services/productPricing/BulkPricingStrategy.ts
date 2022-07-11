import type { IPricingStrategy } from './IPricingStrategy';
import type { Product } from '../../models/Product';
import type { PricingStrategies, ProductConfiguration } from '../../models/ProductConfiguration';

export class BulkPricingStrategy implements IPricingStrategy {
  public getName(): PricingStrategies {
    return 'bulk';
  }

  public calculateDiscount(products: Product[], pricingConfig: ProductConfiguration): number {
    if (products.length >= pricingConfig.config.quantityThreshold) {
      return products.length * Number(pricingConfig.config.discountedPrice);
    }

    return 0;
  }
}
