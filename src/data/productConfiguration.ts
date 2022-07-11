import type { ProductConfiguration } from '../models/ProductConfiguration';

export const productConficuration = (): ProductConfiguration[] => [
  {
    skus: ['atv'],
    strategy: 'quantity',
    config: {
      quantityThreshold: 3,
      discountedPrice: 10950,
    },
  },
  {
    skus: ['ipd'],
    strategy: 'bulk',
    config: {
      quantityThreshold: '4',
      discountedPrice: 5000,
    },
  },
];
