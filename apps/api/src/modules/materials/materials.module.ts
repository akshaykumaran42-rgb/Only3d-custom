import { Module } from "@nestjs/common";
import { MaterialsPresentationModule } from "./presentation/materials.presentation.module";

@Module({
  imports: [MaterialsPresentationModule],
  exports: [MaterialsPresentationModule],
})
export class MaterialsModule {}
