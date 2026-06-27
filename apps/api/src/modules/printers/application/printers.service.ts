import { Injectable, Inject } from "@nestjs/common";
import {
  IPrinterManufacturerRepository,
  IPrinterModelRepository,
  IPrinterRepository,
  IPrinterProfileRepository,
} from "../domain/printer.repository.interface";
import { PrinterManufacturerEntity } from "../domain/printer-manufacturer.entity";
import { PrinterModelEntity } from "../domain/printer-model.entity";
import { PrinterEntity } from "../domain/printer.entity";
import { PrinterProfileEntity } from "../domain/printer-profile.entity";
import {
  CreatePrinterManufacturerDto,
  CreatePrinterModelDto,
  CreatePrinterDto,
  CreatePrinterProfileDto,
} from "./dtos/printers.dto";
import { randomUUID } from "crypto";

@Injectable()
export class PrintersService {
  constructor(
    @Inject("IPrinterManufacturerRepository")
    private readonly manufacturerRepo: IPrinterManufacturerRepository,
    @Inject("IPrinterModelRepository")
    private readonly modelRepo: IPrinterModelRepository,
    @Inject("IPrinterRepository")
    private readonly printerRepo: IPrinterRepository,
    @Inject("IPrinterProfileRepository")
    private readonly profileRepo: IPrinterProfileRepository,
  ) {}

  async createManufacturer(dto: CreatePrinterManufacturerDto) {
    const entity = PrinterManufacturerEntity.create({
      id: randomUUID(),
      name: dto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.manufacturerRepo.save(entity);
  }

  async getManufacturers() {
    return this.manufacturerRepo.findAll();
  }

  async createModel(dto: CreatePrinterModelDto) {
    const entity = PrinterModelEntity.create({
      id: randomUUID(),
      manufacturerId: dto.manufacturerId,
      name: dto.name,
      buildVolumeX: dto.buildVolumeX,
      buildVolumeY: dto.buildVolumeY,
      buildVolumeZ: dto.buildVolumeZ,
      supportedMaterials: dto.supportedMaterials,
      supportedNozzles: dto.supportedNozzles,
      supportedLayerHeights: dto.supportedLayerHeights,
      maxExtruderTemp: dto.maxExtruderTemp,
      maxBedTemp: dto.maxBedTemp,
      averagePowerWatts: dto.averagePowerWatts,
      maxAcceleration: dto.maxAcceleration ?? null,
      maxSpeed: dto.maxSpeed ?? null,
      volumetricFlow: dto.volumetricFlow ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.modelRepo.save(entity);
  }

  async getModels() {
    return this.modelRepo.findAll();
  }

  async createPrinter(dto: CreatePrinterDto) {
    const entity = PrinterEntity.create({
      id: randomUUID(),
      modelId: dto.modelId,
      serialNumber: dto.serialNumber ?? null,
      nickname: dto.nickname,
      maintenanceStatus: dto.maintenanceStatus ?? null,
      status: dto.status ?? "AVAILABLE",
      installedNozzle: dto.installedNozzle ?? null,
      installedBuildPlate: dto.installedBuildPlate ?? null,
      firmwareVersion: dto.firmwareVersion ?? null,
      location: dto.location ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
    return this.printerRepo.save(entity);
  }

  async getPrinters() {
    return this.printerRepo.findAll();
  }

  async createProfile(dto: CreatePrinterProfileDto) {
    const entity = PrinterProfileEntity.create({
      id: randomUUID(),
      printerId: dto.printerId,
      name: dto.name,
      hourlyMachineCost: dto.hourlyMachineCost,
      electricityTariff: dto.electricityTariff,
      depreciationMultiplier: dto.depreciationMultiplier ?? 1.0,
      wearMultiplier: dto.wearMultiplier ?? 1.0,
      failureMultiplier: dto.failureMultiplier ?? 1.0,
      profitMultiplier: dto.profitMultiplier ?? 1.0,
      speedMultiplier: dto.speedMultiplier ?? 1.0,
      qualityMultiplier: dto.qualityMultiplier ?? 1.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.profileRepo.save(entity);
  }

  async getProfiles(printerId: string) {
    return this.profileRepo.findByPrinterId(printerId);
  }
}
