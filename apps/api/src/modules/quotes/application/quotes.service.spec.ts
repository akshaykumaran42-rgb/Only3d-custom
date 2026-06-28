import { describe, it, expect, beforeEach, vi } from "vitest";
import { QuotesService } from "./quotes.service";
import { PricingService } from "./pricing.service";
import { QuoteEntity } from "../domain/quote.entity";
import { IQuoteRepository } from "../domain/quote.repository.interface";
import { IQuoteDataProvider } from "../domain/quote-data.provider.interface";

describe("QuotesService", () => {
  let service: QuotesService;
  let pricingService: PricingService;

  const mockRepo = {
    findById: vi.fn(),
    findAll: vi.fn(),
    save: vi.fn(),
  };

  const mockDataProvider = {
    getQuoteInputData: vi.fn(),
  };

  beforeEach(() => {
    pricingService = new PricingService();
    service = new QuotesService(
      mockRepo as unknown as IQuoteRepository,
      mockDataProvider as unknown as IQuoteDataProvider,
      pricingService,
    );
    vi.clearAllMocks();
  });

  const sampleInputData = {
    uploadId: "upload-1",
    volumeMm3: 100000,
    surfaceAreaMm2: 5000,
    boundingBoxX: 100,
    boundingBoxY: 100,
    boundingBoxZ: 10,
    isManifold: true,
    materialId: "mat-1",
    materialCostPerKg: 2000,
    materialDensity: 1.25,
    printerProfileId: "profile-1",
    hourlyMachineCost: 500,
    electricityTariff: 30,
    powerConsumptionW: 300,
    wearMultiplier: 1.0,
    failureMultiplier: 1.1,
    profitMultiplier: 1.5,
    speedMultiplier: 1.0,
  };

  it("should create and calculate a new quote", async () => {
    mockDataProvider.getQuoteInputData.mockResolvedValue(sampleInputData);
    mockRepo.save.mockImplementation(async (q) => q);

    const quote = await service.createQuote({
      uploadId: "upload-1",
      materialId: "mat-1",
      printerProfileId: "profile-1",
    });

    expect(quote.state).toBe("CALCULATED");
    expect(quote.pricing).toBeDefined();
    expect(quote.pricing!.totalPrice).toBeGreaterThan(0);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it("should reject recalculation of accepted quotes", async () => {
    const acceptedQuote = QuoteEntity.create({
      id: "quote-1",
      customerId: null,
      uploadId: "upload-1",
      materialId: "mat-1",
      printerProfileId: "profile-1",
      state: "ACCEPTED",
      version: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepo.findById.mockResolvedValue(acceptedQuote);

    await expect(service.recalculateQuote("quote-1")).rejects.toThrow(
      "Cannot recalculate an accepted or ordered quote",
    );
  });

  it("should transition to ACCEPTED state", async () => {
    const quote = QuoteEntity.create({
      id: "quote-1",
      customerId: null,
      uploadId: "upload-1",
      materialId: "mat-1",
      printerProfileId: "profile-1",
      state: "CALCULATED",
      version: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepo.findById.mockResolvedValue(quote);
    mockRepo.save.mockImplementation(async (q) => q);

    const accepted = await service.acceptQuote("quote-1");
    expect(accepted.state).toBe("ACCEPTED");
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
