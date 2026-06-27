import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { PrintersService } from "../application/printers.service";
import {
  CreatePrinterManufacturerDto,
  CreatePrinterModelDto,
  CreatePrinterDto,
  CreatePrinterProfileDto,
} from "../application/dtos/printers.dto";

@ApiTags("Printers")
@Controller("printers")
export class PrintersController {
  constructor(private readonly service: PrintersService) {}

  @Post("manufacturers")
  @ApiOperation({ summary: "Create a printer manufacturer" })
  async createManufacturer(@Body() dto: CreatePrinterManufacturerDto) {
    const entity = await this.service.createManufacturer(dto);
    return entity.toJSON();
  }

  @Get("manufacturers")
  @ApiOperation({ summary: "List printer manufacturers" })
  async getManufacturers() {
    const data = await this.service.getManufacturers();
    return data.map((d) => d.toJSON());
  }

  @Post("models")
  @ApiOperation({ summary: "Create a printer model" })
  async createModel(@Body() dto: CreatePrinterModelDto) {
    const entity = await this.service.createModel(dto);
    return entity.toJSON();
  }

  @Get("models")
  @ApiOperation({ summary: "List printer models" })
  async getModels() {
    const data = await this.service.getModels();
    return data.map((d) => d.toJSON());
  }

  @Post()
  @ApiOperation({ summary: "Create a physical printer" })
  async createPrinter(@Body() dto: CreatePrinterDto) {
    const entity = await this.service.createPrinter(dto);
    return entity.toJSON();
  }

  @Get()
  @ApiOperation({ summary: "List physical printers" })
  async getPrinters() {
    const data = await this.service.getPrinters();
    return data.map((d) => d.toJSON());
  }

  @Post("profiles")
  @ApiOperation({ summary: "Create a printer profile" })
  async createProfile(@Body() dto: CreatePrinterProfileDto) {
    const entity = await this.service.createProfile(dto);
    return entity.toJSON();
  }

  @Get(":printerId/profiles")
  @ApiOperation({ summary: "List profiles for a printer" })
  async getProfiles(@Param("printerId") printerId: string) {
    const data = await this.service.getProfiles(printerId);
    return data.map((d) => d.toJSON());
  }
}
