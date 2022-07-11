import { QuantityPricingStrategy } from './QuantityPricingStrategy';
import { PricingService } from './PricingService';

let pricingServiceInstance: PricingService | undefined;

const strategies = [new QuantityPricingStrategy()];

/**
 * Here we define the strategy factory.
 * We can add new strategies by adding a new class that implements the IPricingStrategy interface.
 *
 * @returns {PricingService}
 */
export const PricingStrategyFactory = (): PricingService => {
  return pricingServiceInstance ?? new PricingService(strategies);
};
