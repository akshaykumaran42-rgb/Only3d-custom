import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infrastructure/prisma/prisma.module";
import { UploadsController } from "./presentation/uploads.controller";
import { UploadsService } from "./application/uploads.service";
import { AnalysisService } from "./application/analysis.service";
import { PrismaUploadRepository } from "./persistence/prisma-upload.repository";
import { LocalStorageProvider } from "./persistence/local-storage.provider";

@Module({
  imports: [PrismaModule],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    AnalysisService,
    { provide: "IUploadRepository", useClass: PrismaUploadRepository },
    { provide: "IStorageProvider", useClass: LocalStorageProvider },
  ],
  exports: [UploadsService, AnalysisService],
})
export class UploadsModule {}
