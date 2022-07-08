import type { Product } from './../models/Product';

export interface ICheckoutService {
  items: Product[];
  scan: (item: Product['sku']) => void;
  total: () => number;
}
