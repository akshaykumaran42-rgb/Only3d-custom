import { PrinterManufacturerEntity } from "./printer-manufacturer.entity";
import { PrinterModelEntity } from "./printer-model.entity";
import { PrinterEntity } from "./printer.entity";
import { PrinterProfileEntity } from "./printer-profile.entity";

export interface IPrinterManufacturerRepository {
  findById(id: string): Promise<PrinterManufacturerEntity | null>;
  findAll(): Promise<PrinterManufacturerEntity[]>;
  save(entity: PrinterManufacturerEntity): Promise<PrinterManufacturerEntity>;
}

export interface IPrinterModelRepository {
  findById(id: string): Promise<PrinterModelEntity | null>;
  findAll(): Promise<PrinterModelEntity[]>;
  save(entity: PrinterModelEntity): Promise<PrinterModelEntity>;
}

export interface IPrinterRepository {
  findById(id: string): Promise<PrinterEntity | null>;
  findAll(): Promise<PrinterEntity[]>;
  save(entity: PrinterEntity): Promise<PrinterEntity>;
}

export interface IPrinterProfileRepository {
  findById(id: string): Promise<PrinterProfileEntity | null>;
  findByPrinterId(printerId: string): Promise<PrinterProfileEntity[]>;
  save(entity: PrinterProfileEntity): Promise<PrinterProfileEntity>;
}
