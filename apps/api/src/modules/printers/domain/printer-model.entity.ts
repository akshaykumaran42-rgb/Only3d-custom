export interface PrinterModelProps {
  id: string;
  manufacturerId: string;
  name: string;
  buildVolumeX: number;
  buildVolumeY: number;
  buildVolumeZ: number;
  supportedMaterials: string[];
  supportedNozzles: number[];
  supportedLayerHeights: number[];
  maxExtruderTemp: number;
  maxBedTemp: number;
  averagePowerWatts: number;
  maxAcceleration: number | null;
  maxSpeed: number | null;
  volumetricFlow: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PrinterModelEntity {
  private constructor(private readonly props: PrinterModelProps) {}

  get id() {
    return this.props.id;
  }
  get manufacturerId() {
    return this.props.manufacturerId;
  }
  get name() {
    return this.props.name;
  }

  static create(props: PrinterModelProps): PrinterModelEntity {
    return new PrinterModelEntity(props);
  }

  toJSON() {
    return { ...this.props };
  }
}
