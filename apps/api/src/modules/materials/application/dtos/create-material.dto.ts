import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
  IsObject,
  IsBoolean,
} from "class-validator";
import { MaterialType } from "../../domain/material-type.enum";
import { MaterialStatus } from "../../domain/material-status.enum";

export class CreateMaterialDto {
  @ApiProperty({ example: "PLA Galaxy Black" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "PLA-GB-01" })
  @IsString()
  @IsNotEmpty()
  internalCode!: string;

  @ApiProperty({ example: "PLA" })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiProperty({ example: "Prusament" })
  @IsString()
  @IsNotEmpty()
  brand!: string;

  @ApiProperty({ enum: MaterialType, example: MaterialType.FDM })
  @IsEnum(MaterialType)
  materialType!: MaterialType;

  @ApiProperty({ example: 1.24, description: "g/cm³" })
  @IsNumber()
  @Min(0.01)
  density!: number;

  @ApiProperty({ example: 2999, description: "Cost in cents" })
  @IsNumber()
  @Min(0)
  costPerKg!: number;

  @ApiProperty({
    example: 0.05,
    description: "Selling price per gram in cents",
  })
  @IsNumber()
  @Min(0)
  sellingPricePerGram!: number;

  @ApiPropertyOptional({ example: 1.0 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  defaultPrintSpeedMultiplier?: number = 1.0;

  @ApiProperty({ example: 215 })
  @IsNumber()
  @Min(0)
  nozzleTemperature!: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(0)
  bedTemperature!: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  chamberTemperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  coolingProfile?: Record<string, unknown>;

  @ApiPropertyOptional({ type: [Number], example: [0.4, 0.6] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  compatibleNozzleSizes?: number[] = [];

  @ApiPropertyOptional({ type: [String], example: ["MK3S", "MK4"] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  compatiblePrinterProfiles?: string[] = [];

  @ApiPropertyOptional({ enum: MaterialStatus, example: MaterialStatus.DRAFT })
  @IsOptional()
  @IsEnum(MaterialStatus)
  status?: MaterialStatus = MaterialStatus.DRAFT;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  visibility?: boolean = false;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
