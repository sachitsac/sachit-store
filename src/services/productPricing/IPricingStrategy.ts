import type { PricingStrategies } from './../../models/ProductConfiguration';
import type { Product } from '../../models/Product';
import type { ProductConfiguration } from '../../models/ProductConfiguration';

export interface IPricingStrategy {
  getName: () => PricingStrategies;
  calculateDiscount: (products: Product[], config: ProductConfiguration) => number;
}
