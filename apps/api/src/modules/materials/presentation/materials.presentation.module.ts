import { Module } from "@nestjs/common";
import { MaterialsController } from "./materials.controller";
import { MaterialsService } from "../application/materials.service";
import { MaterialsPersistenceModule } from "../persistence/materials.persistence.module";

@Module({
  imports: [MaterialsPersistenceModule],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsPresentationModule {}
