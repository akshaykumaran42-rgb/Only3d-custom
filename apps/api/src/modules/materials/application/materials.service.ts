import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { MATERIAL_REPOSITORY } from "../persistence/materials.persistence.module";
import { IMaterialRepository } from "../domain/material.repository.interface";
import { MaterialEntity } from "../domain/material.entity";
import { CreateMaterialDto } from "./dtos/create-material.dto";
import { UpdateMaterialDto } from "./dtos/update-material.dto";
import { MaterialQueryDto } from "./dtos/material-query.dto";

@Injectable()
export class MaterialsService {
  constructor(
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: IMaterialRepository,
  ) {}

  async create(dto: CreateMaterialDto): Promise<MaterialEntity> {
    const existingByName = await this.materialRepository.findByName(dto.name);
    if (existingByName) {
      throw new ConflictException(
        `Material with name '${dto.name}' already exists.`,
      );
    }

    const existingByCode = await this.materialRepository.findByInternalCode(
      dto.internalCode,
    );
    if (existingByCode) {
      throw new ConflictException(
        `Material with internal code '${dto.internalCode}' already exists.`,
      );
    }

    const entity = MaterialEntity.create({
      id: uuidv4(),
      name: dto.name,
      internalCode: dto.internalCode,
      category: dto.category,
      brand: dto.brand,
      materialType: dto.materialType,
      density: dto.density,
      costPerKg: dto.costPerKg,
      sellingPricePerGram: dto.sellingPricePerGram,
      defaultPrintSpeedMultiplier: dto.defaultPrintSpeedMultiplier ?? 1.0,
      nozzleTemperature: dto.nozzleTemperature,
      bedTemperature: dto.bedTemperature,
      chamberTemperature: dto.chamberTemperature ?? null,
      coolingProfile: dto.coolingProfile ?? null,
      compatibleNozzleSizes: dto.compatibleNozzleSizes ?? [],
      compatiblePrinterProfiles: dto.compatiblePrinterProfiles ?? [],
      status: dto.status as never, // It is mapped from enum
      visibility: dto.visibility ?? false,
      displayOrder: dto.displayOrder ?? 0,
      description: dto.description ?? null,
      metadata: dto.metadata ?? null,
      thumbnailImageMetadata: null,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await this.materialRepository.save(entity);
    return entity;
  }

  async findAll(query: MaterialQueryDto) {
    return this.materialRepository.searchAndFilter({
      page: query.page,
      limit: query.limit,
      search: query.search,
      status: query.status,
      category: query.category,
      materialType: query.materialType,
      includeDeleted: query.includeDeleted,
    });
  }

  async findOne(id: string): Promise<MaterialEntity> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      throw new NotFoundException(`Material with ID '${id}' not found.`);
    }
    return material;
  }

  async update(id: string, dto: UpdateMaterialDto): Promise<MaterialEntity> {
    const material = await this.findOne(id);
    const updateDto = dto as Partial<CreateMaterialDto>;

    if (updateDto.name && updateDto.name !== material.name) {
      const existing = await this.materialRepository.findByName(updateDto.name);
      if (existing) {
        throw new ConflictException(
          `Material with name '${updateDto.name}' already exists.`,
        );
      }
    }

    if (
      updateDto.internalCode &&
      updateDto.internalCode !== material.internalCode
    ) {
      const existing = await this.materialRepository.findByInternalCode(
        updateDto.internalCode,
      );
      if (existing) {
        throw new ConflictException(
          `Material with internal code '${updateDto.internalCode}' already exists.`,
        );
      }
    }

    // Convert DTO to Partial<MaterialProps> ignoring undefined keys
    const updates = Object.fromEntries(
      Object.entries(updateDto).filter(([_, v]) => v !== undefined),
    );

    material.update(updates);
    await this.materialRepository.save(material);
    return material;
  }

  async remove(id: string): Promise<void> {
    const material = await this.findOne(id);
    material.markAsDeleted();
    await this.materialRepository.save(material);
  }

  async restore(id: string): Promise<MaterialEntity> {
    const material = await this.findOne(id);
    material.restore();
    await this.materialRepository.save(material);
    return material;
  }
}
