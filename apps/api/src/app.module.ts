import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MaterialsModule } from "./modules/materials/materials.module";
import { PrintersModule } from "./modules/printers/printers.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { QuotesModule } from "./modules/quotes/quotes.module";

@Module({
  imports: [MaterialsModule, PrintersModule, UploadsModule, QuotesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
