import type { ProductConfiguration } from '../models/ProductConfiguration';

export interface IProductConfigurationRepository {
  getProductConfiguration: () => ProductConfiguration[];
  findBySku: (sku: string) => ProductConfiguration | undefined;
}
