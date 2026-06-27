import { Module } from "@nestjs/common";
import { PrismaModule } from "../../../infrastructure/prisma/prisma.module";
import { PrismaMaterialRepository } from "./prisma-material.repository";

export const MATERIAL_REPOSITORY = "MATERIAL_REPOSITORY";

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: MATERIAL_REPOSITORY,
      useClass: PrismaMaterialRepository,
    },
  ],
  exports: [MATERIAL_REPOSITORY],
})
export class MaterialsPersistenceModule {}
