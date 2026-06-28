import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { QuotesService } from "../application/quotes.service";
import { CreateQuoteDto } from "../application/dtos/create-quote.dto";

@Controller("quotes")
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async createQuote(@Body() dto: CreateQuoteDto) {
    const quote = await this.quotesService.createQuote(dto);
    return quote.toJSON();
  }

  @Get()
  async getQuotes(@Query("customerId") customerId?: string) {
    const quotes = await this.quotesService.listQuotes(customerId);
    return quotes.map((q) => q.toJSON());
  }

  @Get(":id")
  async getQuote(@Param("id") id: string) {
    const quote = await this.quotesService.getQuote(id);
    return quote.toJSON();
  }

  @Post(":id/recalculate")
  @HttpCode(HttpStatus.OK)
  async recalculateQuote(@Param("id") id: string) {
    const quote = await this.quotesService.recalculateQuote(id);
    return quote.toJSON();
  }

  @Post(":id/accept")
  @HttpCode(HttpStatus.OK)
  async acceptQuote(@Param("id") id: string) {
    const quote = await this.quotesService.acceptQuote(id);
    return quote.toJSON();
  }

  @Post(":id/reject")
  @HttpCode(HttpStatus.OK)
  async rejectQuote(@Param("id") id: string) {
    const quote = await this.quotesService.rejectQuote(id);
    return quote.toJSON();
  }
}
