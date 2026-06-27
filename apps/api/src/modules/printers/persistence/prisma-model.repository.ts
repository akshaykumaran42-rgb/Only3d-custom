import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IPrinterModelRepository } from "../domain/printer.repository.interface";
import { PrinterModelEntity } from "../domain/printer-model.entity";
import { PrinterModel } from "@only3d/database";

@Injectable()
export class PrismaPrinterModelRepository implements IPrinterModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: PrinterModel): PrinterModelEntity {
    return PrinterModelEntity.create({
      id: model.id,
      manufacturerId: model.manufacturerId,
      name: model.name,
      buildVolumeX: model.buildVolumeX,
      buildVolumeY: model.buildVolumeY,
      buildVolumeZ: model.buildVolumeZ,
      supportedMaterials: model.supportedMaterials,
      supportedNozzles: model.supportedNozzles,
      supportedLayerHeights: model.supportedLayerHeights,
      maxExtruderTemp: model.maxExtruderTemp,
      maxBedTemp: model.maxBedTemp,
      averagePowerWatts: model.averagePowerWatts,
      maxAcceleration: model.maxAcceleration,
      maxSpeed: model.maxSpeed,
      volumetricFlow: model.volumetricFlow,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async findById(id: string): Promise<PrinterModelEntity | null> {
    const data = await this.prisma.printerModel.findUnique({ where: { id } });
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(): Promise<PrinterModelEntity[]> {
    const data = await this.prisma.printerModel.findMany();
    return data.map((d) => this.mapToDomain(d));
  }

  async save(entity: PrinterModelEntity): Promise<PrinterModelEntity> {
    const data = entity.toJSON();
    const existing = await this.prisma.printerModel.findUnique({
      where: { id: data.id },
    });
    if (existing) {
      await this.prisma.printerModel.update({ where: { id: data.id }, data });
    } else {
      await this.prisma.printerModel.create({ data });
    }
    return entity;
  }
}
