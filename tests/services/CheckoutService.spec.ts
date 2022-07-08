import { instance, mock, reset, verify, when } from 'ts-mockito';
import { CheckoutService } from '../../src/services/CheckoutService';
import type { ICheckoutService } from './../../src/services/ICheckoutService';
import type { IProductRepository } from '../../src/repositories/IProductRepository';
import type { Product } from './../../src/models/Product';

const mockedProductRepository = mock<IProductRepository>();
const setup = (): ICheckoutService => new CheckoutService(instance(mockedProductRepository));

describe('Checkout Service', () => {
  beforeEach(() => {
    reset(mockedProductRepository);
  });

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
    checkoutService.scan(item.sku);
    expect(checkoutService.items.length).toEqual(1);
  });

  it('should return total = 0 if no items are scanned', () => {
    const checkoutService = setup();
    expect(checkoutService.total()).toEqual(0);
  });

  it('should throw an error if product cannot be scanned', () => {
    const checkoutService = setup();
    when(mockedProductRepository.findProductBySku('test')).thenThrow(new Error('Product with sku test not found'));
    try {
      checkoutService.scan('test');
      verify(mockedProductRepository.findProductBySku('test')).once();
      fail('product not found');
    } catch (error: unknown) {
      expect((error as Error).message).toEqual('Product with sku test not found');
    }
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
      sku: 'test-2',
    };
    when(mockedProductRepository.findProductBySku(item1.sku)).thenReturn(item1);
    when(mockedProductRepository.findProductBySku(item2.sku)).thenReturn(item2);
    const checkoutService = setup();
    checkoutService.scan(item1.sku);
    checkoutService.scan(item2.sku);
    verify(mockedProductRepository.findProductBySku(item1.sku)).once();
    verify(mockedProductRepository.findProductBySku(item2.sku)).once();
    expect(checkoutService.total()).toEqual(25);
  });
});
