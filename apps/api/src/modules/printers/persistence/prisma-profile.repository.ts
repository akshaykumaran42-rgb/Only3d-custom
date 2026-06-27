import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IPrinterProfileRepository } from "../domain/printer.repository.interface";
import { PrinterProfileEntity } from "../domain/printer-profile.entity";
import { PrinterProfile } from "@only3d/database";

@Injectable()
export class PrismaPrinterProfileRepository implements IPrinterProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: PrinterProfile): PrinterProfileEntity {
    return PrinterProfileEntity.create({
      id: model.id,
      printerId: model.printerId,
      name: model.name,
      hourlyMachineCost: model.hourlyMachineCost,
      electricityTariff: model.electricityTariff,
      depreciationMultiplier: model.depreciationMultiplier,
      wearMultiplier: model.wearMultiplier,
      failureMultiplier: model.failureMultiplier,
      profitMultiplier: model.profitMultiplier,
      speedMultiplier: model.speedMultiplier,
      qualityMultiplier: model.qualityMultiplier,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async findById(id: string): Promise<PrinterProfileEntity | null> {
    const data = await this.prisma.printerProfile.findUnique({ where: { id } });
    return data ? this.mapToDomain(data) : null;
  }

  async findByPrinterId(printerId: string): Promise<PrinterProfileEntity[]> {
    const data = await this.prisma.printerProfile.findMany({
      where: { printerId },
    });
    return data.map((d) => this.mapToDomain(d));
  }

  async save(entity: PrinterProfileEntity): Promise<PrinterProfileEntity> {
    const data = entity.toJSON();
    const existing = await this.prisma.printerProfile.findUnique({
      where: { id: data.id },
    });
    if (existing) {
      await this.prisma.printerProfile.update({ where: { id: data.id }, data });
    } else {
      await this.prisma.printerProfile.create({ data });
    }
    return entity;
  }
}
