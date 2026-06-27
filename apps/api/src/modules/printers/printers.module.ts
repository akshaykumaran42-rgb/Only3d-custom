import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infrastructure/prisma/prisma.module";
import { PrintersController } from "./presentation/printers.controller";
import { PrintersService } from "./application/printers.service";
import { PrismaPrinterManufacturerRepository } from "./persistence/prisma-manufacturer.repository";
import { PrismaPrinterModelRepository } from "./persistence/prisma-model.repository";
import { PrismaPrinterRepository } from "./persistence/prisma-printer.repository";
import { PrismaPrinterProfileRepository } from "./persistence/prisma-profile.repository";

@Module({
  imports: [PrismaModule],
  controllers: [PrintersController],
  providers: [
    PrintersService,
    {
      provide: "IPrinterManufacturerRepository",
      useClass: PrismaPrinterManufacturerRepository,
    },
    {
      provide: "IPrinterModelRepository",
      useClass: PrismaPrinterModelRepository,
    },
    { provide: "IPrinterRepository", useClass: PrismaPrinterRepository },
    {
      provide: "IPrinterProfileRepository",
      useClass: PrismaPrinterProfileRepository,
    },
  ],
  exports: [PrintersService],
})
export class PrintersModule {}
