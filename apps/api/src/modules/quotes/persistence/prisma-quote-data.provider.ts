import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IQuoteDataProvider } from "../domain/quote-data.provider.interface";
import { QuoteInputSnapshot } from "../domain/quote.entity";

@Injectable()
export class PrismaQuoteDataProvider implements IQuoteDataProvider {
  constructor(private readonly prisma: PrismaService) {}

  async getQuoteInputData(
    uploadId: string,
    materialId: string,
    printerProfileId: string,
  ): Promise<QuoteInputSnapshot> {
    const upload = await this.prisma.upload.findUnique({
      where: { id: uploadId },
      include: { analysis: true },
    });

    if (!upload) throw new NotFoundException(`Upload ${uploadId} not found`);
    if (!upload.analysis)
      throw new NotFoundException(`Analysis for upload ${uploadId} not found`);

    const material = await this.prisma.material.findUnique({
      where: { id: materialId },
    });
    if (!material)
      throw new NotFoundException(`Material ${materialId} not found`);

    const printerProfile = await this.prisma.printerProfile.findUnique({
      where: { id: printerProfileId },
      include: { printer: { include: { model: true } } },
    });
    if (!printerProfile)
      throw new NotFoundException(
        `PrinterProfile ${printerProfileId} not found`,
      );

    return {
      uploadId: upload.id,
      volumeMm3: upload.analysis.volumeMm3,
      surfaceAreaMm2: upload.analysis.surfaceAreaMm2,
      boundingBoxX: upload.analysis.boundingBoxX,
      boundingBoxY: upload.analysis.boundingBoxY,
      boundingBoxZ: upload.analysis.boundingBoxZ,
      isManifold: upload.analysis.isManifold,

      materialId: material.id,
      materialCostPerKg: material.costPerKg,
      materialDensity: material.density,

      printerProfileId: printerProfile.id,
      hourlyMachineCost: printerProfile.hourlyMachineCost,
      electricityTariff: printerProfile.electricityTariff,
      powerConsumptionW: printerProfile.printer.model.averagePowerWatts,
      wearMultiplier: printerProfile.wearMultiplier,
      failureMultiplier: printerProfile.failureMultiplier,
      profitMultiplier: printerProfile.profitMultiplier,
      speedMultiplier: printerProfile.speedMultiplier,
    };
  }
}
