import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MaterialsModule } from "./modules/materials/materials.module";
import { PrintersModule } from "./modules/printers/printers.module";

@Module({
  imports: [MaterialsModule, PrintersModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
