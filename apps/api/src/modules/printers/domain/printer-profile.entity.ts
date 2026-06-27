export interface PrinterProfileProps {
  id: string;
  printerId: string;
  name: string;
  hourlyMachineCost: number;
  electricityTariff: number;
  depreciationMultiplier: number;
  wearMultiplier: number;
  failureMultiplier: number;
  profitMultiplier: number;
  speedMultiplier: number;
  qualityMultiplier: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PrinterProfileEntity {
  private constructor(private readonly props: PrinterProfileProps) {}

  get id() {
    return this.props.id;
  }
  get printerId() {
    return this.props.printerId;
  }
  get name() {
    return this.props.name;
  }

  static create(props: PrinterProfileProps): PrinterProfileEntity {
    return new PrinterProfileEntity(props);
  }

  toJSON() {
    return { ...this.props };
  }
}
