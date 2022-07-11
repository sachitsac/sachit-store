import type { ProductConfiguration } from './../../../src/models/ProductConfiguration';
import type { Product } from './../../../src/models/Product';
import { instance, mock, reset, when, verify } from 'ts-mockito';
import type { IPricingStrategy } from '../../../src/services/productPricing/IPricingStrategy';
import { PricingService } from '../../../src/services/productPricing/PricingService';

const mockStrategy = mock<IPricingStrategy>();

const setup = (): PricingService => new PricingService([instance(mockStrategy)]);

describe('Pricing Service', () => {
  beforeEach(() => {
    reset(mockStrategy);
  });

  it('should be defined', () => {
    expect(PricingService).toBeDefined();
  });

  it('should throw an error if no strategy is found', () => {
    const service = setup();
    const products: Product[] = [{ sku: 'item1', name: 'Item 1', price: 10 }];
    const config: ProductConfiguration = {
      skus: ['item1'],
      strategy: 'none',
      config: { quantityThreshold: 1, discountedPrice: 5 },
    };
    when(mockStrategy.getName()).thenReturn('quantity');
    expect(() => service.getTotalDiscount(products, config)).toThrow('No pricing strategy found for none');
  });

  it('should return the correct total discount', () => {
    const service = setup();
    const products: Product[] = [{ sku: 'item1', name: 'Item 1', price: 10 }];
    const config: ProductConfiguration = {
      skus: ['item1'],
      strategy: 'quantity',
      config: { quantityThreshold: 1, discountedPrice: 5 },
    };
    when(mockStrategy.getName()).thenReturn('quantity');
    when(mockStrategy.calculateDiscount(products, config)).thenReturn(5);
    const result = service.getTotalDiscount(products, config);
    verify(mockStrategy.getName()).once();
    verify(mockStrategy.calculateDiscount(products, config)).once();
    expect(result).toBe(5);
  });
});
