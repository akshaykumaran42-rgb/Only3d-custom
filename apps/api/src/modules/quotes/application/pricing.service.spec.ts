import { describe, it, expect, beforeEach } from "vitest";
import { PricingService } from "./pricing.service";
import { QuoteInputSnapshot } from "../domain/quote.entity";

describe("PricingService", () => {
  let service: PricingService;

  beforeEach(() => {
    service = new PricingService();
  });

  const baseInput: QuoteInputSnapshot = {
    uploadId: "upload-1",
    volumeMm3: 100000, // 100 cm3
    surfaceAreaMm2: 5000,
    boundingBoxX: 100,
    boundingBoxY: 100,
    boundingBoxZ: 10,
    isManifold: true,
    materialId: "mat-1",
    materialCostPerKg: 2000, // $20.00 / kg
    materialDensity: 1.25, // 1.25 g/cm3 -> 125g for 100cm3
    printerProfileId: "profile-1",
    hourlyMachineCost: 500, // $5.00 / hour
    electricityTariff: 30, // 30 cents per kWh
    powerConsumptionW: 300, // 300 watts
    wearMultiplier: 1.0,
    failureMultiplier: 1.1, // +10%
    profitMultiplier: 1.5, // 50% profit margin
    speedMultiplier: 1.0,
  };

  it("should calculate accurate pricing breakdown", () => {
    const result = service.calculatePricing(baseInput);

    // Weight: 100 cm3 * 1.25 g/cm3 = 125 g = 0.125 kg
    // Material Cost: 0.125 * 2000 = 250 cents
    expect(result.materialCost).toBe(250);

    // Time: 100 cm3 / 50 cm3/hr = 2 hours
    // Machine Cost: 2 hr * 500 = 1000 cents
    expect(result.machineCost).toBe(1000);

    // Electricity: 300W = 0.3kW * 2hr = 0.6kWh * 30 cents = 18 cents
    expect(result.electricityCost).toBe(18);

    // Wear: 2 hr * (500 * 0.1) * 1.0 = 100 cents
    expect(result.machineWearCost).toBe(100);

    // Base cost: 250 + 1000 + 18 + 100 = 1368
    // Failure margin: 1368 * 0.1 (1.1 - 1.0) = 137
    expect(result.failureMarginCost).toBe(137);

    // Support: 250 * 0.1 = 25
    expect(result.supportMaterialCost).toBe(25);

    // Constants:
    expect(result.postProcessingCost).toBe(500);
    expect(result.packagingCost).toBe(250);
    expect(result.shippingCost).toBe(1000);

    // Subtotal = 1368 + 137 + 25 + 500 + 250 + 1000 = 3280
    // Profit margin: 3280 * 0.5 (1.5 - 1.0) = 1640
    expect(result.profitMargin).toBe(1640);

    // Taxable: 3280 + 1640 = 4920
    // Tax: 4920 * 0.2 = 984
    expect(result.tax).toBe(984);

    // Total: 4920 + 984 = 5904
    expect(result.totalPrice).toBe(5904);
  });

  it("should respect speed multipliers", () => {
    const fastInput = { ...baseInput, speedMultiplier: 2.0 };
    const result = service.calculatePricing(fastInput);

    // Time: 2 hrs / 2.0 = 1 hr
    expect(result.machineCost).toBe(500); // 1 hr * 500
    expect(result.electricityCost).toBe(9); // 0.3kW * 1hr * 30
    expect(result.machineWearCost).toBe(50); // 1 hr * 50
  });

  it("should calculate failure margin gracefully when multiplier < 1", () => {
    const strictInput = { ...baseInput, failureMultiplier: 0.5 };
    const result = service.calculatePricing(strictInput);

    // failureMarginRate = Math.max(0, 0.5 - 1.0) = 0
    expect(result.failureMarginCost).toBe(0);
  });
});
