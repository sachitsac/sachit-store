import { instance, mock, reset, verify, when } from 'ts-mockito';
import { CheckoutService } from '../../src/services/CheckoutService';
import type { ICheckoutService } from './../../src/services/ICheckoutService';
import type { IProductConfigurationRepository } from '../../src/repositories/IProductConfigurationRepository';
import type { IProductRepository } from '../../src/repositories/IProductRepository';
import type { Product } from './../../src/models/Product';

const mockedProductRepository = mock<IProductRepository>();
const mockedProductConfigurationRepository = mock<IProductConfigurationRepository>();
const setup = (): ICheckoutService =>
  new CheckoutService(instance(mockedProductRepository), instance(mockedProductConfigurationRepository));

describe('Checkout Service', () => {
  beforeEach(() => {
    reset(mockedProductRepository);
  });

  it('should be defined', () => {
    expect(CheckoutService).toBeDefined();
  });

  describe('with no discount', () => {
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

    describe('with quantity discounts', () => {
      it('should apply quantity discount', () => {
        const checkoutService = setup();
        const item1 = {
          sku: 'atv',
          name: 'Apple TV',
          price: 10950,
        };
        const item2 = {
          sku: 'vga',
          name: 'VGA adapter',
          price: 3000,
        };
        when(mockedProductRepository.findProductBySku(item1.sku)).thenReturn(item1);
        when(mockedProductRepository.findProductBySku(item2.sku)).thenReturn(item2);
        when(mockedProductConfigurationRepository.findBySku(item1.sku)).thenReturn({
          skus: [item1.sku],
          strategy: 'quantity',
          config: {
            quantityThreshold: 3,
            discountedPrice: 10950,
          },
        });
        checkoutService.scan(item1.sku);
        checkoutService.scan(item1.sku);
        checkoutService.scan(item1.sku);
        checkoutService.scan(item2.sku);
        verify(mockedProductRepository.findProductBySku(item1.sku)).times(3);
        verify(mockedProductRepository.findProductBySku(item2.sku)).once();
        expect(checkoutService.total()).toEqual(24900);
      });

      it('should apply quantity discount twice', () => {
        const checkoutService = setup();
        const item1 = {
          sku: 'atv',
          name: 'Apple TV',
          price: 10950,
        };
        const item2 = {
          sku: 'vga',
          name: 'VGA adapter',
          price: 3000,
        };
        when(mockedProductRepository.findProductBySku(item1.sku)).thenReturn(item1);
        when(mockedProductRepository.findProductBySku(item2.sku)).thenReturn(item2);
        when(mockedProductConfigurationRepository.findBySku(item1.sku)).thenReturn({
          skus: [item1.sku],
          strategy: 'quantity',
          config: {
            quantityThreshold: 3,
            discountedPrice: 10950,
          },
        });
        checkoutService.scan(item1.sku); // 10950
        checkoutService.scan(item1.sku); // 10950
        checkoutService.scan(item1.sku); // Free
        checkoutService.scan(item1.sku); // 10950
        checkoutService.scan(item1.sku); // 10950
        checkoutService.scan(item1.sku); // Free
        checkoutService.scan(item1.sku); // 10950
        checkoutService.scan(item2.sku); // 3000
        verify(mockedProductRepository.findProductBySku(item1.sku)).times(7);
        verify(mockedProductRepository.findProductBySku(item2.sku)).once();
        expect(checkoutService.total()).toEqual(57750);
      });

      it('should apply no discount if productConfig not found', () => {
        const checkoutService = setup();
        const item1 = {
          sku: 'atv',
          name: 'Apple TV',
          price: 10950,
        };
        const item2 = {
          sku: 'vga',
          name: 'VGA adapter',
          price: 3000,
        };
        when(mockedProductRepository.findProductBySku(item1.sku)).thenReturn(item1);
        when(mockedProductRepository.findProductBySku(item2.sku)).thenReturn(item2);
        when(mockedProductConfigurationRepository.findBySku(item1.sku)).thenReturn(undefined);
        checkoutService.scan(item1.sku);
        checkoutService.scan(item2.sku);
        verify(mockedProductRepository.findProductBySku(item1.sku)).once();
        verify(mockedProductRepository.findProductBySku(item2.sku)).once();
        expect(checkoutService.total()).toEqual(10950 + 3000);
      });

      it('should apply no discount if productConfig found but threshhold not reached', () => {
        const checkoutService = setup();
        const item1 = {
          sku: 'atv',
          name: 'Apple TV',
          price: 10950,
        };
        const item2 = {
          sku: 'vga',
          name: 'VGA adapter',
          price: 3000,
        };
        when(mockedProductRepository.findProductBySku(item1.sku)).thenReturn(item1);
        when(mockedProductRepository.findProductBySku(item2.sku)).thenReturn(item2);
        when(mockedProductConfigurationRepository.findBySku(item1.sku)).thenReturn({
          skus: [item1.sku],
          strategy: 'quantity',
          config: {
            quantityThreshold: 3,
            discountedPrice: 10950,
          },
        });
        checkoutService.scan(item1.sku);
        checkoutService.scan(item1.sku);
        verify(mockedProductRepository.findProductBySku(item1.sku)).twice();
        expect(checkoutService.total()).toEqual(10950 + 10950);
      });
    });
  });

  describe('with bulk discount', () => {
    it('should apply bulk discount', () => {
      const checkoutService = setup();
      const item1 = {
        sku: 'ipd',
        name: 'Super iPad',
        price: 54999,
      };
      when(mockedProductRepository.findProductBySku(item1.sku)).thenReturn(item1);
      when(mockedProductConfigurationRepository.findBySku(item1.sku)).thenReturn({
        skus: [item1.sku],
        strategy: 'bulk',
        config: {
          quantityThreshold: 4,
          discountedPrice: 5000,
        },
      });
      checkoutService.scan(item1.sku); // 49999
      checkoutService.scan(item1.sku); // 49999
      checkoutService.scan(item1.sku); // 49999
      checkoutService.scan(item1.sku); // 49999
      checkoutService.scan(item1.sku); // 49999
      expect(checkoutService.total()).toEqual(49999 * 5);
    });

    it('should apply no discount', () => {
      const checkoutService = setup();
      const item1 = {
        sku: 'ipd',
        name: 'Super iPad',
        price: 54999,
      };
      when(mockedProductRepository.findProductBySku(item1.sku)).thenReturn(item1);
      when(mockedProductConfigurationRepository.findBySku(item1.sku)).thenReturn({
        skus: [item1.sku],
        strategy: 'bulk',
        config: {
          quantityThreshold: 4,
          discountedPrice: 5000,
        },
      });
      checkoutService.scan(item1.sku); // 54999
      checkoutService.scan(item1.sku); // 54999
      checkoutService.scan(item1.sku); // 54999
      expect(checkoutService.total()).toEqual(54999 * 3);
    });
  });
});
