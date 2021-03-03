import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from 'sequelize-typescript';

@Table({ modelName: 'Settings' })
export class Settings extends Model<Settings> {
  @AllowNull(false)
  @Column(DataType.STRING)
  userId?: string;

  @Column(DataType.BOOLEAN)
  commentsOnMyStatuses?: boolean;

  @Column(DataType.BOOLEAN)
  likesOnMyStatuses?: boolean;

  @Column(DataType.BOOLEAN)
  commentsOnCommentedStatuses?: boolean;

  @Column(DataType.BOOLEAN)
  commentsOnLikedStatuses?: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default Settings;
