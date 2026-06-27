/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IMaterialRepository } from "../domain/material.repository.interface";
import { MaterialEntity, MaterialProps } from "../domain/material.entity";
import { MaterialType, MaterialStatus } from "@only3d/database";
import { MaterialType as DomainMaterialType } from "../domain/material-type.enum";
import { MaterialStatus as DomainMaterialStatus } from "../domain/material-status.enum";

@Injectable()
export class PrismaMaterialRepository implements IMaterialRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(prismaMaterial: any): MaterialEntity {
    return MaterialEntity.create({
      id: prismaMaterial.id,
      name: prismaMaterial.name,
      internalCode: prismaMaterial.internalCode,
      category: prismaMaterial.category,
      brand: prismaMaterial.brand,
      materialType:
        prismaMaterial.materialType as unknown as DomainMaterialType,
      density: prismaMaterial.density,
      costPerKg: prismaMaterial.costPerKg,
      sellingPricePerGram: prismaMaterial.sellingPricePerGram,
      defaultPrintSpeedMultiplier: prismaMaterial.defaultPrintSpeedMultiplier,
      nozzleTemperature: prismaMaterial.nozzleTemperature,
      bedTemperature: prismaMaterial.bedTemperature,
      chamberTemperature: prismaMaterial.chamberTemperature,
      coolingProfile: prismaMaterial.coolingProfile as Record<
        string,
        any
      > | null,
      compatibleNozzleSizes: prismaMaterial.compatibleNozzleSizes,
      compatiblePrinterProfiles: prismaMaterial.compatiblePrinterProfiles,
      status: prismaMaterial.status as unknown as DomainMaterialStatus,
      visibility: prismaMaterial.visibility,
      displayOrder: prismaMaterial.displayOrder,
      description: prismaMaterial.description,
      metadata: prismaMaterial.metadata as Record<string, any> | null,
      thumbnailImageMetadata: prismaMaterial.thumbnailImageMetadata as Record<
        string,
        any
      > | null,
      version: prismaMaterial.version,
      createdAt: prismaMaterial.createdAt,
      updatedAt: prismaMaterial.updatedAt,
      deletedAt: prismaMaterial.deletedAt,
    });
  }

  private mapToPrisma(domain: MaterialEntity) {
    const json = domain.toJSON();
    return {
      id: json.id,
      name: json.name,
      internalCode: json.internalCode,
      category: json.category,
      brand: json.brand,
      materialType: json.materialType as unknown as MaterialType,
      density: json.density,
      costPerKg: json.costPerKg,
      sellingPricePerGram: json.sellingPricePerGram,
      defaultPrintSpeedMultiplier: json.defaultPrintSpeedMultiplier,
      nozzleTemperature: json.nozzleTemperature,
      bedTemperature: json.bedTemperature,
      chamberTemperature: json.chamberTemperature,
      coolingProfile: json.coolingProfile ? json.coolingProfile : undefined,
      compatibleNozzleSizes: json.compatibleNozzleSizes,
      compatiblePrinterProfiles: json.compatiblePrinterProfiles,
      status: json.status as unknown as MaterialStatus,
      visibility: json.visibility,
      displayOrder: json.displayOrder,
      description: json.description,
      metadata: json.metadata ? json.metadata : undefined,
      thumbnailImageMetadata: json.thumbnailImageMetadata
        ? json.thumbnailImageMetadata
        : undefined,
      version: json.version,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      deletedAt: json.deletedAt,
    };
  }

  async findById(id: string): Promise<MaterialEntity | null> {
    const material = await this.prisma.material.findUnique({ where: { id } });
    if (!material) return null;
    return this.mapToDomain(material);
  }

  async findByInternalCode(
    internalCode: string,
  ): Promise<MaterialEntity | null> {
    const material = await this.prisma.material.findUnique({
      where: { internalCode },
    });
    if (!material) return null;
    return this.mapToDomain(material);
  }

  async findByName(name: string): Promise<MaterialEntity | null> {
    const material = await this.prisma.material.findUnique({ where: { name } });
    if (!material) return null;
    return this.mapToDomain(material);
  }

  async findAll(): Promise<MaterialEntity[]> {
    const materials = await this.prisma.material.findMany();
    return materials.map((m) => this.mapToDomain(m));
  }

  async save(entity: MaterialEntity): Promise<MaterialEntity> {
    const data = this.mapToPrisma(entity);

    // Check if it's an update or create
    const exists = await this.prisma.material.findUnique({
      where: { id: entity.id },
    });

    if (exists) {
      // Optimistic locking check
      if (exists.version !== entity.version) {
        throw new Error(
          "Concurrency conflict: The material was modified by another user.",
        );
      }

      const updateData = { ...data, version: data.version + 1 };
      await this.prisma.material.update({
        where: { id: entity.id },
        data: updateData,
      });
      // Reflect new version in domain object (using private property access or a method, for now we bypass to keep sync)
      (entity as any).props.version = updateData.version;
    } else {
      await this.prisma.material.create({
        data,
      });
    }
    return entity;
  }

  async delete(id: string): Promise<void> {
    // Hard delete is rarely used, usually we soft delete via save()
    await this.prisma.material.delete({ where: { id } });
  }

  async searchAndFilter(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    materialType?: string;
    includeDeleted?: boolean;
  }): Promise<{ data: MaterialEntity[]; total: number }> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (!query.includeDeleted) {
      where.deletedAt = null;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { internalCode: { contains: query.search, mode: "insensitive" } },
        { brand: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.status) {
      where.status = query.status as MaterialStatus;
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.materialType) {
      where.materialType = query.materialType as MaterialType;
    }

    const [total, materials] = await this.prisma.$transaction([
      this.prisma.material.count({ where }),
      this.prisma.material.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      }),
    ]);

    return {
      data: materials.map((m) => this.mapToDomain(m)),
      total,
    };
  }
}
