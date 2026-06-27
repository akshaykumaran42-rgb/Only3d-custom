import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MaterialsModule } from "./modules/materials/materials.module";
import { PrintersModule } from "./modules/printers/printers.module";
import { UploadsModule } from "./modules/uploads/uploads.module";

@Module({
  imports: [MaterialsModule, PrintersModule, UploadsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
