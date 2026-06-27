export interface PrinterProps {
  id: string;
  modelId: string;
  serialNumber: string | null;
  nickname: string;
  maintenanceStatus: string | null;
  status:
    | "AVAILABLE"
    | "IN_USE"
    | "OFFLINE"
    | "NEEDS_MAINTENANCE"
    | "UNDER_REPAIR";
  installedNozzle: number | null;
  installedBuildPlate: string | null;
  firmwareVersion: string | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PrinterEntity {
  private constructor(private readonly props: PrinterProps) {}

  get id() {
    return this.props.id;
  }
  get modelId() {
    return this.props.modelId;
  }
  get status() {
    return this.props.status;
  }

  static create(props: PrinterProps): PrinterEntity {
    return new PrinterEntity(props);
  }

  toJSON() {
    return { ...this.props };
  }
}
