import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IPrinterRepository } from "../domain/printer.repository.interface";
import { PrinterEntity } from "../domain/printer.entity";
import { Printer, PrinterStatus } from "@only3d/database";

@Injectable()
export class PrismaPrinterRepository implements IPrinterRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: Printer): PrinterEntity {
    return PrinterEntity.create({
      id: model.id,
      modelId: model.modelId,
      serialNumber: model.serialNumber,
      nickname: model.nickname,
      maintenanceStatus: model.maintenanceStatus,
      status: model.status as
        | "AVAILABLE"
        | "IN_USE"
        | "OFFLINE"
        | "NEEDS_MAINTENANCE"
        | "UNDER_REPAIR",
      installedNozzle: model.installedNozzle,
      installedBuildPlate: model.installedBuildPlate,
      firmwareVersion: model.firmwareVersion,
      location: model.location,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    });
  }

  async findById(id: string): Promise<PrinterEntity | null> {
    const data = await this.prisma.printer.findUnique({ where: { id } });
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(): Promise<PrinterEntity[]> {
    const data = await this.prisma.printer.findMany();
    return data.map((d) => this.mapToDomain(d));
  }

  async save(entity: PrinterEntity): Promise<PrinterEntity> {
    const data = entity.toJSON();
    const prismaData = {
      ...data,
      status: data.status as PrinterStatus,
    };
    const existing = await this.prisma.printer.findUnique({
      where: { id: data.id },
    });
    if (existing) {
      await this.prisma.printer.update({
        where: { id: data.id },
        data: prismaData,
      });
    } else {
      await this.prisma.printer.create({ data: prismaData });
    }
    return entity;
  }
}
