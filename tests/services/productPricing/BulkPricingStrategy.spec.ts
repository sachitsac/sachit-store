import type { Product } from '../../../src/models/Product';
import type { ProductConfiguration } from '../../../src/models/ProductConfiguration';
import { BulkPricingStrategy } from '../../../src/services/productPricing/BulkPricingStrategy';

const setup = (): BulkPricingStrategy => new BulkPricingStrategy();

describe('BulkPricingStrategy', () => {
  it('should be defined', () => {
    expect(BulkPricingStrategy).toBeDefined();
  });

  it('should return name as quantity', () => {
    const strategy = setup();
    expect(strategy.getName()).toBe('bulk');
  });

  it('should return correct total discount', () => {
    const strategy = setup();
    const products: Product[] = [
      { sku: 'item1', name: 'Item 1', price: 10 },
      { sku: 'item1', name: 'Item 1', price: 10 },
    ];
    const config: ProductConfiguration = {
      skus: ['item1'],
      strategy: 'bulk',
      config: { quantityThreshold: 1, discountedPrice: 5 },
    };
    expect(strategy.calculateDiscount(products, config)).toBe(10);
  });

  it('should return 0 if no discount', () => {
    const strategy = setup();
    const products: Product[] = [{ sku: 'item1', name: 'Item 1', price: 10 }];
    const config: ProductConfiguration = {
      skus: ['item1'],
      strategy: 'quantity',
      config: { quantityThreshold: 2, discountedPrice: 5 },
    };
    expect(strategy.calculateDiscount(products, config)).toBe(0);
  });

  it('should return correct discount for multiple of the same product', () => {
    const strategy = setup();
    const products: Product[] = [
      { sku: 'item1', name: 'Item 1', price: 10 },
      { sku: 'item1', name: 'Item 1', price: 10 },
      { sku: 'item1', name: 'Item 1', price: 10 },
      { sku: 'item1', name: 'Item 1', price: 10 },
      { sku: 'item1', name: 'Item 1', price: 10 },
    ];
    const config: ProductConfiguration = {
      skus: ['item1'],
      strategy: 'quantity',
      config: { quantityThreshold: 3, discountedPrice: 5 },
    };
    expect(strategy.calculateDiscount(products, config)).toBe(25);
  });
});
