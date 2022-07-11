import type { IProductConfigurationRepository } from './IProductConfigurationRepository';
import { productConficuration } from '../data/productConfiguration';
import type { ProductConfiguration } from '../models/ProductConfiguration';

export class ProductConfigurationRepository implements IProductConfigurationRepository {
  public findBySku(sku: string): ProductConfiguration | undefined {
    return this.getProductConfiguration().find((c) => c.skus.includes(sku));
  }

  public getProductConfiguration(): ProductConfiguration[] {
    return productConficuration();
  }
}
