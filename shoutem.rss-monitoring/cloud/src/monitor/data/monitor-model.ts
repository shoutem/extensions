import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from 'sequelize-typescript';

@Table({ modelName: 'Monitors' })
export class Monitor extends Model<Monitor> {
  @AllowNull(false)
  @Column(DataType.STRING)
  appId!: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default Monitor;
