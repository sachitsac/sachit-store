import { CheckoutService } from '../../src/services/CheckoutService';
import type { ICheckoutService } from './../../src/services/ICheckoutService';
import type { Product } from './../../src/models/Product';

const setup = (): ICheckoutService => new CheckoutService();

describe('Checkout Service', () => {
  it('should be defined', () => {
    expect(CheckoutService).toBeDefined();
  });

  it('should scan an item', () => {
    const item: Product = {
      name: 'test',
      price: 1,
      sku: 'test',
    };
    const checkoutService = setup();
    checkoutService.scan(item);
    expect(checkoutService.items.length).toEqual(1);
  });

  it('should return item total', () => {
    const item1: Product = {
      name: 'test',
      price: 10,
      sku: 'test',
    };
    const item2: Product = {
      name: 'test',
      price: 15,
      sku: 'test',
    };
    const checkoutService = setup();
    checkoutService.scan(item1);
    checkoutService.scan(item2);
    expect(checkoutService.total()).toEqual(25);
  });
});
