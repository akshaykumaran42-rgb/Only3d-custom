/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Test, TestingModule } from "@nestjs/testing";
import { MaterialsService } from "./materials.service";
import { MATERIAL_REPOSITORY } from "../persistence/materials.persistence.module";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { MaterialEntity } from "../domain/material.entity";

describe("MaterialsService", () => {
  let service: MaterialsService;
  let mockRepository: any;

  beforeEach(async () => {
    mockRepository = {
      save: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      findByInternalCode: vi.fn(),
      searchAndFilter: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaterialsService,
        {
          provide: MATERIAL_REPOSITORY,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaterialsService>(MaterialsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should throw ConflictException if material name exists", async () => {
      mockRepository.findByName.mockResolvedValue(true);
      await expect(
        service.create({ name: "PLA", internalCode: "1" } as any),
      ).rejects.toThrow(ConflictException);
    });

    it("should create and save a new material", async () => {
      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.findByInternalCode.mockResolvedValue(null);

      const material = await service.create({
        name: "PLA",
        internalCode: "PLA-01",
        category: "Standard",
        brand: "BrandX",
        materialType: "FDM" as any,
        density: 1.24,
        costPerKg: 2000,
        sellingPricePerGram: 0.05,
        nozzleTemperature: 215,
        bedTemperature: 60,
      } as any);

      expect(material).toBeInstanceOf(MaterialEntity);
      expect(material.name).toEqual("PLA");
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should throw NotFoundException if not found", async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });
});
