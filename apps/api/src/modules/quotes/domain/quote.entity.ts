export type QuoteState =
  | "DRAFT"
  | "CALCULATED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "ORDERED";

export interface QuoteInputSnapshot {
  uploadId: string;
  volumeMm3: number;
  surfaceAreaMm2: number;
  boundingBoxX: number;
  boundingBoxY: number;
  boundingBoxZ: number;
  isManifold: boolean;
  materialId: string;
  materialCostPerKg: number;
  materialDensity: number; // g/cm3
  printerProfileId: string;
  hourlyMachineCost: number;
  electricityTariff: number; // cost per kWh
  powerConsumptionW: number; // Watt
  wearMultiplier: number;
  failureMultiplier: number;
  profitMultiplier: number;
  speedMultiplier: number;
}

export interface QuotePricingSnapshot {
  materialCost: number; // cents
  machineCost: number; // cents
  electricityCost: number; // cents
  machineWearCost: number; // cents
  failureMarginCost: number; // cents
  supportMaterialCost: number; // cents
  postProcessingCost: number; // cents
  packagingCost: number; // cents
  shippingCost: number; // cents
  profitMargin: number; // cents
  tax: number; // cents
  totalPrice: number; // cents
}

export interface QuoteProps {
  id: string;
  customerId: string | null;
  uploadId: string;
  materialId: string;
  printerProfileId: string;
  state: QuoteState;
  version: number;
  uploadSnapshot?: Record<string, unknown>;
  analysisSnapshot?: Record<string, unknown>;
  materialSnapshot?: Record<string, unknown>;
  printerSnapshot?: Record<string, unknown>;
  ruleSnapshot?: Record<string, unknown>;
  pricing?: QuotePricingSnapshot;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
}

export class QuoteEntity {
  private constructor(private readonly props: QuoteProps) {}

  public static create(props: QuoteProps): QuoteEntity {
    return new QuoteEntity(props);
  }

  public toJSON(): QuoteProps {
    return { ...this.props };
  }

  public get id(): string {
    return this.props.id;
  }
  public get state(): QuoteState {
    return this.props.state;
  }
  public get pricing(): QuotePricingSnapshot | undefined {
    return this.props.pricing;
  }

  public updatePricing(
    pricing: QuotePricingSnapshot,
    snapshots: {
      upload: Record<string, unknown>;
      analysis: Record<string, unknown>;
      material: Record<string, unknown>;
      printer: Record<string, unknown>;
      rules: Record<string, unknown>;
    },
  ): void {
    if (this.props.state === "ACCEPTED" || this.props.state === "ORDERED") {
      throw new Error(
        "Cannot update pricing for an accepted or ordered quote.",
      );
    }
    this.props.pricing = pricing;
    this.props.uploadSnapshot = snapshots.upload;
    this.props.analysisSnapshot = snapshots.analysis;
    this.props.materialSnapshot = snapshots.material;
    this.props.printerSnapshot = snapshots.printer;
    this.props.ruleSnapshot = snapshots.rules;
    this.props.state = "CALCULATED";
    this.props.version += 1;
    this.props.updatedAt = new Date();
  }

  public accept(): void {
    if (this.props.state !== "CALCULATED") {
      throw new Error("Can only accept a calculated quote.");
    }
    this.props.state = "ACCEPTED";
    this.props.updatedAt = new Date();
  }

  public reject(): void {
    if (this.props.state !== "CALCULATED") {
      throw new Error("Can only reject a calculated quote.");
    }
    this.props.state = "REJECTED";
    this.props.updatedAt = new Date();
  }

  public expire(): void {
    if (this.props.state === "ACCEPTED" || this.props.state === "ORDERED") {
      throw new Error("Cannot expire an accepted or ordered quote.");
    }
    this.props.state = "EXPIRED";
    this.props.updatedAt = new Date();
  }

  public convertToOrder(): void {
    if (this.props.state !== "ACCEPTED") {
      throw new Error("Can only order an accepted quote.");
    }
    this.props.state = "ORDERED";
    this.props.updatedAt = new Date();
  }
}
