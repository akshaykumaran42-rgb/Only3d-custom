/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MaterialType } from "./material-type.enum";
import { MaterialStatus } from "./material-status.enum";
import { DomainError } from "../../../core/errors/domain.error";

export interface MaterialProps {
  id: string;
  name: string;
  internalCode: string;
  category: string;
  brand: string;
  materialType: MaterialType;
  density: number;
  costPerKg: number;
  sellingPricePerGram: number;
  defaultPrintSpeedMultiplier: number;
  nozzleTemperature: number;
  bedTemperature: number;
  chamberTemperature: number | null;
  coolingProfile: Record<string, any> | null;
  compatibleNozzleSizes: number[];
  compatiblePrinterProfiles: string[];
  status: MaterialStatus;
  visibility: boolean;
  displayOrder: number;
  description: string | null;
  metadata: Record<string, any> | null;
  thumbnailImageMetadata: Record<string, any> | null;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class MaterialEntity {
  private constructor(private readonly props: MaterialProps) {
    this.validate();
  }

  static create(props: MaterialProps): MaterialEntity {
    return new MaterialEntity(props);
  }

  // --- Getters ---
  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
  get internalCode(): string {
    return this.props.internalCode;
  }
  get category(): string {
    return this.props.category;
  }
  get brand(): string {
    return this.props.brand;
  }
  get materialType(): MaterialType {
    return this.props.materialType;
  }
  get density(): number {
    return this.props.density;
  }
  get costPerKg(): number {
    return this.props.costPerKg;
  }
  get sellingPricePerGram(): number {
    return this.props.sellingPricePerGram;
  }
  get defaultPrintSpeedMultiplier(): number {
    return this.props.defaultPrintSpeedMultiplier;
  }
  get nozzleTemperature(): number {
    return this.props.nozzleTemperature;
  }
  get bedTemperature(): number {
    return this.props.bedTemperature;
  }
  get chamberTemperature(): number | null {
    return this.props.chamberTemperature;
  }
  get coolingProfile(): Record<string, any> | null {
    return this.props.coolingProfile;
  }
  get compatibleNozzleSizes(): number[] {
    return this.props.compatibleNozzleSizes;
  }
  get compatiblePrinterProfiles(): string[] {
    return this.props.compatiblePrinterProfiles;
  }
  get status(): MaterialStatus {
    return this.props.status;
  }
  get visibility(): boolean {
    return this.props.visibility;
  }
  get displayOrder(): number {
    return this.props.displayOrder;
  }
  get description(): string | null {
    return this.props.description;
  }
  get metadata(): Record<string, any> | null {
    return this.props.metadata;
  }
  get thumbnailImageMetadata(): Record<string, any> | null {
    return this.props.thumbnailImageMetadata;
  }
  get version(): number {
    return this.props.version;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  // --- Domain Logic & State Changes ---

  update(
    props: Partial<
      Omit<
        MaterialProps,
        "id" | "createdAt" | "updatedAt" | "deletedAt" | "version"
      >
    >,
  ): void {
    if (this.props.deletedAt) {
      throw new DomainError(
        "MATERIAL_ERROR",
        "Cannot update a deleted material.",
      );
    }
    Object.assign(this.props, props);
    this.validate();
  }

  markAsDeleted(): void {
    if (this.props.deletedAt) {
      throw new DomainError("MATERIAL_ERROR", "Material is already deleted.");
    }
    this.props.deletedAt = new Date();
    this.props.status = MaterialStatus.INACTIVE;
    this.props.visibility = false;
  }

  restore(): void {
    if (!this.props.deletedAt) {
      throw new DomainError("MATERIAL_ERROR", "Material is not deleted.");
    }
    this.props.deletedAt = null;
    this.props.status = MaterialStatus.DRAFT;
  }

  publish(): void {
    if (this.props.deletedAt) {
      throw new DomainError(
        "MATERIAL_ERROR",
        "Cannot publish a deleted material.",
      );
    }
    this.props.status = MaterialStatus.ACTIVE;
    this.props.visibility = true;
  }

  // --- Validation ---
  private validate(): void {
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new DomainError("MATERIAL_ERROR", "Material name cannot be empty.");
    }
    if (
      !this.props.internalCode ||
      this.props.internalCode.trim().length === 0
    ) {
      throw new DomainError(
        "MATERIAL_ERROR",
        "Material internal code cannot be empty.",
      );
    }
    if (this.props.density <= 0) {
      throw new DomainError(
        "MATERIAL_ERROR",
        "Material density must be greater than zero.",
      );
    }
    if (this.props.costPerKg < 0) {
      throw new DomainError(
        "MATERIAL_ERROR",
        "Cost per kg cannot be negative.",
      );
    }
    if (this.props.sellingPricePerGram < 0) {
      throw new DomainError(
        "MATERIAL_ERROR",
        "Selling price per gram cannot be negative.",
      );
    }
    if (this.props.defaultPrintSpeedMultiplier <= 0) {
      throw new DomainError(
        "MATERIAL_ERROR",
        "Print speed multiplier must be greater than zero.",
      );
    }
    if (this.props.compatibleNozzleSizes.length > 0) {
      for (const size of this.props.compatibleNozzleSizes) {
        if (size <= 0)
          throw new DomainError(
            "MATERIAL_ERROR",
            "Nozzle size must be greater than zero.",
          );
      }
    }
  }

  toJSON() {
    return { ...this.props };
  }
}
