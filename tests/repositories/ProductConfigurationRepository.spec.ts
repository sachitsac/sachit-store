import * as productConficuration from './../../src/data/productConfiguration';
import { ProductConfigurationRepository } from '../../src/repositories/ProductConfigurationRepository';

describe('Product Configuration Repository', () => {
  it('should be defined', () => {
    expect(ProductConfigurationRepository).toBeDefined();
  });

  it('should return undefined if no config found', () => {
    const productConfigRepository = new ProductConfigurationRepository();
    expect(productConfigRepository.findBySku('test')).toBeUndefined();
  });

  it('should return product if found', () => {
    const productConfigMock = jest.spyOn(productConficuration, 'productConficuration');
    productConfigMock.mockReturnValue([
      {
        skus: ['test'],
        strategy: 'bulk',
        config: { price: 10 },
      },
    ]);
    const productConfigRepository = new ProductConfigurationRepository();
    const productConfig = productConfigRepository.findBySku('test');
    expect(productConfig).toBeDefined();
  });
});
