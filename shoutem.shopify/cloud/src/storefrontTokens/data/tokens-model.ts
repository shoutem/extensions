import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
} from 'sequelize-typescript';

@Table({ modelName: 'StorefrontTokens' })
export class Tokens extends Model<Tokens> {
  @AllowNull(false)
  @Column(DataType.TEXT)
  access_token!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  appId?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  shop!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  access_scope?: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  created_at?: Date;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  external_id?: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  admin_graphql_api_id?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title?: string;
}

export default Tokens;
