import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateQuoteDto {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsNotEmpty()
  uploadId!: string;

  @IsString()
  @IsNotEmpty()
  materialId!: string;

  @IsString()
  @IsNotEmpty()
  printerProfileId!: string;
}
