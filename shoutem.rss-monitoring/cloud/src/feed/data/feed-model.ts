import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  AllowNull,
} from 'sequelize-typescript';
import { Monitor } from '../../monitor/data/monitor-model';

@Table({ modelName: 'Feeds' })
export class Feed extends Model<Feed> {
  @AllowNull(false)
  @Column(DataType.STRING)
  feedKey!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  lastFeedItemHash?: string;

  @BelongsTo(() => Monitor)
  monitor?: Monitor;

  @ForeignKey(() => Monitor)
  @Column(DataType.INTEGER)
  monitorId?: number;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default Feed;
