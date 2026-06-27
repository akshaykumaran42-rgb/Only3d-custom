export interface PrinterManufacturerProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PrinterManufacturerEntity {
  private constructor(private readonly props: PrinterManufacturerProps) {}

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: PrinterManufacturerProps): PrinterManufacturerEntity {
    return new PrinterManufacturerEntity(props);
  }

  toJSON() {
    return { ...this.props };
  }
}
