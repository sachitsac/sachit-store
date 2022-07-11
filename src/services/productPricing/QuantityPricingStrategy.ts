import type { IPricingStrategy } from './IPricingStrategy';
import type { Product } from '../../models/Product';
import type { PricingStrategies, ProductConfiguration } from '../../models/ProductConfiguration';

export class QuantityPricingStrategy implements IPricingStrategy {
  public getName(): PricingStrategies {
    return 'quantity';
  }

  public calculateDiscount(products: Product[], pricingConfig: ProductConfiguration): number {
    const quantity = products.length;
    const discount = Math.floor(quantity / Number(pricingConfig.config.quantityThreshold));
    return discount > 0 ? discount * Number(pricingConfig.config.discountedPrice) : 0;
  }
}
