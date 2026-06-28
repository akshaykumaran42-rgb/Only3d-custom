import { Module } from "@nestjs/common";
import { PrismaModule } from "../../infrastructure/prisma/prisma.module";
import { QuotesController } from "./presentation/quotes.controller";
import { QuotesService } from "./application/quotes.service";
import { PricingService } from "./application/pricing.service";
import { PrismaQuoteRepository } from "./persistence/prisma-quote.repository";
import { PrismaQuoteDataProvider } from "./persistence/prisma-quote-data.provider";

@Module({
  imports: [PrismaModule],
  controllers: [QuotesController],
  providers: [
    QuotesService,
    PricingService,
    {
      provide: "IQuoteRepository",
      useClass: PrismaQuoteRepository,
    },
    {
      provide: "IQuoteDataProvider",
      useClass: PrismaQuoteDataProvider,
    },
  ],
  exports: [QuotesService],
})
export class QuotesModule {}
