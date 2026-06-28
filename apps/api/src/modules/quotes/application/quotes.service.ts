import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { IQuoteRepository } from "../domain/quote.repository.interface";
import { IQuoteDataProvider } from "../domain/quote-data.provider.interface";
import { QuoteEntity } from "../domain/quote.entity";
import { PricingService } from "./pricing.service";
import { CreateQuoteDto } from "./dtos/create-quote.dto";

@Injectable()
export class QuotesService {
  constructor(
    @Inject("IQuoteRepository") private readonly repository: IQuoteRepository,
    @Inject("IQuoteDataProvider")
    private readonly dataProvider: IQuoteDataProvider,
    private readonly pricingService: PricingService,
  ) {}

  async createQuote(dto: CreateQuoteDto): Promise<QuoteEntity> {
    const quote = QuoteEntity.create({
      id: crypto.randomUUID(),
      customerId: dto.customerId || null,
      uploadId: dto.uploadId,
      materialId: dto.materialId,
      printerProfileId: dto.printerProfileId,
      state: "DRAFT",
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.calculateAndSaveQuote(quote);
  }

  async recalculateQuote(quoteId: string): Promise<QuoteEntity> {
    const quote = await this.repository.findById(quoteId);
    if (!quote) throw new NotFoundException(`Quote ${quoteId} not found`);

    if (quote.state === "ACCEPTED" || quote.state === "ORDERED") {
      throw new BadRequestException(
        "Cannot recalculate an accepted or ordered quote.",
      );
    }

    return await this.calculateAndSaveQuote(quote);
  }

  async acceptQuote(quoteId: string): Promise<QuoteEntity> {
    const quote = await this.repository.findById(quoteId);
    if (!quote) throw new NotFoundException(`Quote ${quoteId} not found`);

    quote.accept();
    return await this.repository.save(quote);
  }

  async rejectQuote(quoteId: string): Promise<QuoteEntity> {
    const quote = await this.repository.findById(quoteId);
    if (!quote) throw new NotFoundException(`Quote ${quoteId} not found`);

    quote.reject();
    return await this.repository.save(quote);
  }

  async getQuote(quoteId: string): Promise<QuoteEntity> {
    const quote = await this.repository.findById(quoteId);
    if (!quote) throw new NotFoundException(`Quote ${quoteId} not found`);
    return quote;
  }

  async listQuotes(customerId?: string): Promise<QuoteEntity[]> {
    return await this.repository.findAll({ customerId });
  }

  private async calculateAndSaveQuote(
    quote: QuoteEntity,
  ): Promise<QuoteEntity> {
    const inputData = await this.dataProvider.getQuoteInputData(
      quote.toJSON().uploadId,
      quote.toJSON().materialId,
      quote.toJSON().printerProfileId,
    );

    const pricing = this.pricingService.calculatePricing(inputData);

    const rulesSnapshot = {
      version: "1.0",
      description: "Default business rules engine snapshot",
    };

    quote.updatePricing(pricing, {
      upload: {
        id: inputData.uploadId,
        volumeMm3: inputData.volumeMm3,
        surfaceAreaMm2: inputData.surfaceAreaMm2,
        isManifold: inputData.isManifold,
      },
      analysis: {
        volumeMm3: inputData.volumeMm3,
        surfaceAreaMm2: inputData.surfaceAreaMm2,
        boundingBoxX: inputData.boundingBoxX,
        boundingBoxY: inputData.boundingBoxY,
        boundingBoxZ: inputData.boundingBoxZ,
      },
      material: {
        id: inputData.materialId,
        costPerKg: inputData.materialCostPerKg,
        density: inputData.materialDensity,
      },
      printer: {
        id: inputData.printerProfileId,
        hourlyMachineCost: inputData.hourlyMachineCost,
        electricityTariff: inputData.electricityTariff,
        powerConsumptionW: inputData.powerConsumptionW,
      },
      rules: rulesSnapshot,
    });

    return await this.repository.save(quote);
  }
}
