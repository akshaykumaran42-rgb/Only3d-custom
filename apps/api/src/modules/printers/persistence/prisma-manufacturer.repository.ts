import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IPrinterManufacturerRepository } from "../domain/printer.repository.interface";
import { PrinterManufacturerEntity } from "../domain/printer-manufacturer.entity";
import { PrinterManufacturer } from "@only3d/database";

@Injectable()
export class PrismaPrinterManufacturerRepository implements IPrinterManufacturerRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: PrinterManufacturer): PrinterManufacturerEntity {
    return PrinterManufacturerEntity.create({
      id: model.id,
      name: model.name,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  async findById(id: string): Promise<PrinterManufacturerEntity | null> {
    const data = await this.prisma.printerManufacturer.findUnique({
      where: { id },
    });
    return data ? this.mapToDomain(data) : null;
  }

  async findAll(): Promise<PrinterManufacturerEntity[]> {
    const data = await this.prisma.printerManufacturer.findMany();
    return data.map((d) => this.mapToDomain(d));
  }

  async save(
    entity: PrinterManufacturerEntity,
  ): Promise<PrinterManufacturerEntity> {
    const data = entity.toJSON();
    const existing = await this.prisma.printerManufacturer.findUnique({
      where: { id: data.id },
    });
    if (existing) {
      await this.prisma.printerManufacturer.update({
        where: { id: data.id },
        data,
      });
    } else {
      await this.prisma.printerManufacturer.create({ data });
    }
    return entity;
  }
}
