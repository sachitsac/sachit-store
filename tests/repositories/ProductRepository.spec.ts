import * as productList from './../../src/data/products';
import { ProductRepository } from '../../src/repositories/ProductRepository';

describe('Product Repository', () => {
  it('should be defined', () => {
    expect(ProductRepository).toBeDefined();
  });

  it('should throw an error if product not found', () => {
    const productRepository = new ProductRepository();
    try {
      productRepository.findProductBySku('test');
      fail('product not found');
    } catch (error: unknown) {
      expect((error as Error).message).toEqual('Product with sku test not found');
    }
  });

  it('should return product if found', () => {
    const productsMock = jest.spyOn(productList, 'products');
    productsMock.mockReturnValue([
      {
        sku: 'test',
        name: 'test product',
        price: 10,
      },
    ]);
    const productRepository = new ProductRepository();
    const product = productRepository.findProductBySku('test');
    expect(product.sku).toEqual('test');
    expect(product.name).toEqual('test product');
    expect(product.price).toEqual(10);
  });
});
