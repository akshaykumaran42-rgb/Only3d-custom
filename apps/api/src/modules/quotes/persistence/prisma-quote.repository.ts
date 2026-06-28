import { Injectable } from "@nestjs/common";
import {
  QuoteState as PrismaQuoteState,
  Prisma,
  Quote,
} from "@only3d/database";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { IQuoteRepository } from "../domain/quote.repository.interface";
import { QuoteEntity, QuoteState } from "../domain/quote.entity";

@Injectable()
export class PrismaQuoteRepository implements IQuoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(record: Quote): QuoteEntity {
    return QuoteEntity.create({
      id: record.id,
      customerId: record.customerId,
      uploadId: record.uploadId,
      materialId: record.materialId,
      printerProfileId: record.printerProfileId,
      state: record.state as QuoteState,
      version: record.version,
      uploadSnapshot: record.uploadSnapshot
        ? (record.uploadSnapshot as Record<string, unknown>)
        : undefined,
      analysisSnapshot: record.analysisSnapshot
        ? (record.analysisSnapshot as Record<string, unknown>)
        : undefined,
      materialSnapshot: record.materialSnapshot
        ? (record.materialSnapshot as Record<string, unknown>)
        : undefined,
      printerSnapshot: record.printerSnapshot
        ? (record.printerSnapshot as Record<string, unknown>)
        : undefined,
      ruleSnapshot: record.ruleSnapshot
        ? (record.ruleSnapshot as Record<string, unknown>)
        : undefined,
      pricing:
        record.totalPrice != null
          ? {
              materialCost: record.materialCost as number,
              machineCost: record.machineCost as number,
              electricityCost: record.electricityCost as number,
              machineWearCost: record.machineWearCost as number,
              failureMarginCost: record.failureMarginCost as number,
              supportMaterialCost: record.supportMaterialCost as number,
              postProcessingCost: record.postProcessingCost as number,
              packagingCost: record.packagingCost as number,
              shippingCost: record.shippingCost as number,
              profitMargin: record.profitMargin as number,
              tax: record.tax as number,
              totalPrice: record.totalPrice as number,
            }
          : undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      expiresAt: record.expiresAt,
    });
  }

  private toPersistence(entity: QuoteEntity): Prisma.QuoteUncheckedCreateInput {
    const props = entity.toJSON();
    return {
      id: props.id,
      customerId: props.customerId,
      uploadId: props.uploadId,
      materialId: props.materialId,
      printerProfileId: props.printerProfileId,
      state: props.state as PrismaQuoteState,
      version: props.version,
      uploadSnapshot: props.uploadSnapshot
        ? (props.uploadSnapshot as Prisma.InputJsonValue)
        : undefined,
      analysisSnapshot: props.analysisSnapshot
        ? (props.analysisSnapshot as Prisma.InputJsonValue)
        : undefined,
      materialSnapshot: props.materialSnapshot
        ? (props.materialSnapshot as Prisma.InputJsonValue)
        : undefined,
      printerSnapshot: props.printerSnapshot
        ? (props.printerSnapshot as Prisma.InputJsonValue)
        : undefined,
      ruleSnapshot: props.ruleSnapshot
        ? (props.ruleSnapshot as Prisma.InputJsonValue)
        : undefined,

      materialCost: props.pricing?.materialCost ?? null,
      machineCost: props.pricing?.machineCost ?? null,
      electricityCost: props.pricing?.electricityCost ?? null,
      machineWearCost: props.pricing?.machineWearCost ?? null,
      failureMarginCost: props.pricing?.failureMarginCost ?? null,
      supportMaterialCost: props.pricing?.supportMaterialCost ?? null,
      postProcessingCost: props.pricing?.postProcessingCost ?? null,
      packagingCost: props.pricing?.packagingCost ?? null,
      shippingCost: props.pricing?.shippingCost ?? null,
      profitMargin: props.pricing?.profitMargin ?? null,
      tax: props.pricing?.tax ?? null,
      totalPrice: props.pricing?.totalPrice ?? null,

      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      expiresAt: props.expiresAt || null,
    };
  }

  async findById(id: string): Promise<QuoteEntity | null> {
    const record = await this.prisma.quote.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findAll(options?: {
    customerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<QuoteEntity[]> {
    const records = await this.prisma.quote.findMany({
      where: options?.customerId
        ? { customerId: options.customerId }
        : undefined,
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: "desc" },
    });
    return records.map(this.toDomain);
  }

  async save(quote: QuoteEntity): Promise<QuoteEntity> {
    const data = this.toPersistence(quote);
    const saved = await this.prisma.quote.upsert({
      where: { id: data.id },
      create: data,
      update: { ...data, version: data.version }, // Basic optimistic lock conceptually, but doing upsert
    });
    return this.toDomain(saved);
  }
}
