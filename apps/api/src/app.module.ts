import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MaterialsModule } from "./modules/materials/materials.module";

@Module({
  imports: [MaterialsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
