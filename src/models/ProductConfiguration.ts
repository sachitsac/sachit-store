import type { Product } from './Product';

export type PricingStrategies = 'quantity' | 'bulk' | 'none';

export type ProductConfiguration = {
  skus: Array<Product['sku']>;
  strategy: PricingStrategies;
  config: Record<string, string | number>;
};
