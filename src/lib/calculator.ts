import { roundTo3 } from "./utils";

export interface CalculationResult {
  profit: number;
  netProfit: number;
  purifyingAmount: number;
  finalProfit: number;
}

export interface CalculationInput {
  purchaseValue: number;
  marketValue: number;
  appFees: number;
  thirdPartyFee: number;
  purifyingPercentage: number;
}

export function calculate(input: CalculationInput): CalculationResult | null {
  const {
    purchaseValue,
    marketValue,
    appFees,
    thirdPartyFee,
    purifyingPercentage,
  } = input;

  if (isNaN(purchaseValue) || isNaN(marketValue)) {
    return null;
  }

  const profit = roundTo3(marketValue - purchaseValue);
  const netProfit = roundTo3(profit - appFees - thirdPartyFee);
  const purifyingAmount = roundTo3(
    profit > 0 ? profit * (purifyingPercentage / 100) : 0
  );
  const finalProfit = roundTo3(netProfit - purifyingAmount);

  return { profit, netProfit, purifyingAmount, finalProfit };
}

