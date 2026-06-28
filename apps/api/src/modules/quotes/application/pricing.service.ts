import { Injectable } from "@nestjs/common";
import {
  QuoteInputSnapshot,
  QuotePricingSnapshot,
} from "../domain/quote.entity";

@Injectable()
export class PricingService {
  public calculatePricing(input: QuoteInputSnapshot): QuotePricingSnapshot {
    // 1. Material Cost
    // volume (mm3) -> cm3 -> grams -> kg -> cost
    const volumeCm3 = input.volumeMm3 / 1000;
    const weightGrams = volumeCm3 * input.materialDensity;
    const weightKg = weightGrams / 1000;
    const materialCost = Math.round(weightKg * input.materialCostPerKg); // cents

    // Estimated Print Time (simplified heuristic)
    // In a real system this would come from a slicer. For now, heuristics:
    // Basic heuristic: 1 hour per 50cm3, adjusted by speed multiplier
    const baseTimeHours = volumeCm3 / 50;
    const estimatedTimeHours = baseTimeHours / input.speedMultiplier;

    // 2. Machine Cost
    const machineCost = Math.round(
      estimatedTimeHours * input.hourlyMachineCost,
    ); // cents

    // 3. Electricity Cost
    // energy (kWh) = power (W) / 1000 * time (h)
    const energyKwh = (input.powerConsumptionW / 1000) * estimatedTimeHours;
    const electricityCost = Math.round(energyKwh * input.electricityTariff); // cents

    // 4. Machine Wear
    // Wear cost is proportional to machine cost and wear multiplier
    const baseWearCostPerHour = input.hourlyMachineCost * 0.1; // 10% of hourly cost is wear
    const machineWearCost = Math.round(
      estimatedTimeHours * baseWearCostPerHour * input.wearMultiplier,
    );

    // 5. Failure Margin
    const baseCost =
      materialCost + machineCost + electricityCost + machineWearCost;
    // failure multiplier: 1.0 means 0% extra, 1.1 means 10% extra
    const failureMarginRate = Math.max(0, input.failureMultiplier - 1.0);
    const failureMarginCost = Math.round(baseCost * failureMarginRate);

    // 6. Support Material (placeholder)
    // Assume 10% of volume is support
    const supportMaterialCost = Math.round(materialCost * 0.1);

    // 7. Post Processing Cost (placeholder)
    const postProcessingCost = 500; // flat 500 cents ($5.00)

    // 8. Packaging Cost (placeholder)
    const packagingCost = 250; // flat 250 cents ($2.50)

    // 9. Shipping Cost (placeholder)
    const shippingCost = 1000; // flat 1000 cents ($10.00)

    // 10. Profit Margin
    const subtotal =
      baseCost +
      failureMarginCost +
      supportMaterialCost +
      postProcessingCost +
      packagingCost +
      shippingCost;
    // profit multiplier: 1.0 means no profit, 1.5 means 50% profit margin on cost
    const profitMarginRate = Math.max(0, input.profitMultiplier - 1.0);
    const profitMargin = Math.round(subtotal * profitMarginRate);

    // 11. Tax Placeholder
    const taxableAmount = subtotal + profitMargin;
    const taxRate = 0.2; // 20%
    const tax = Math.round(taxableAmount * taxRate);

    const totalPrice = taxableAmount + tax;

    return {
      materialCost,
      machineCost,
      electricityCost,
      machineWearCost,
      failureMarginCost,
      supportMaterialCost,
      postProcessingCost,
      packagingCost,
      shippingCost,
      profitMargin,
      tax,
      totalPrice,
    };
  }
}
