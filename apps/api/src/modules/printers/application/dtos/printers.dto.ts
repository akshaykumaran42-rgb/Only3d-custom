import { IsString, IsNumber, IsArray, IsOptional, Min } from "class-validator";

export class CreatePrinterManufacturerDto {
  @IsString()
  name!: string;
}

export class CreatePrinterModelDto {
  @IsString()
  manufacturerId!: string;
  @IsString()
  name!: string;

  @IsNumber() @Min(0) buildVolumeX!: number;
  @IsNumber() @Min(0) buildVolumeY!: number;
  @IsNumber() @Min(0) buildVolumeZ!: number;

  @IsArray() @IsString({ each: true }) supportedMaterials!: string[];
  @IsArray() @IsNumber({}, { each: true }) supportedNozzles!: number[];
  @IsArray() @IsNumber({}, { each: true }) supportedLayerHeights!: number[];

  @IsNumber() @Min(0) maxExtruderTemp!: number;
  @IsNumber() @Min(0) maxBedTemp!: number;
  @IsNumber() @Min(0) averagePowerWatts!: number;

  @IsOptional() @IsNumber() @Min(0) maxAcceleration?: number;
  @IsOptional() @IsNumber() @Min(0) maxSpeed?: number;
  @IsOptional() @IsNumber() @Min(0) volumetricFlow?: number;
}

export class CreatePrinterDto {
  @IsString()
  modelId!: string;
  @IsString()
  nickname!: string;
  @IsOptional() @IsString() serialNumber?: string;
  @IsOptional() @IsString() maintenanceStatus?: string;
  @IsOptional() @IsString() status?:
    | "AVAILABLE"
    | "IN_USE"
    | "OFFLINE"
    | "NEEDS_MAINTENANCE"
    | "UNDER_REPAIR";
  @IsOptional() @IsNumber() installedNozzle?: number;
  @IsOptional() @IsString() installedBuildPlate?: string;
  @IsOptional() @IsString() firmwareVersion?: string;
  @IsOptional() @IsString() location?: string;
}

export class CreatePrinterProfileDto {
  @IsString() printerId!: string;
  @IsString() name!: string;
  @IsNumber() @Min(0) hourlyMachineCost!: number;
  @IsNumber() @Min(0) electricityTariff!: number;
  @IsOptional() @IsNumber() @Min(0) depreciationMultiplier?: number;
  @IsOptional() @IsNumber() @Min(0) wearMultiplier?: number;
  @IsOptional() @IsNumber() @Min(0) failureMultiplier?: number;
  @IsOptional() @IsNumber() @Min(0) profitMultiplier?: number;
  @IsOptional() @IsNumber() @Min(0) speedMultiplier?: number;
  @IsOptional() @IsNumber() @Min(0) qualityMultiplier?: number;
}
