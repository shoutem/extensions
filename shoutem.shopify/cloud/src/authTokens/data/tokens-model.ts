import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
} from 'sequelize-typescript';

@Table({ modelName: 'OAuthTokens' })
export class Tokens extends Model<Tokens> {
  @AllowNull(false)
  @Column(DataType.TEXT)
  access_token!: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  shop!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  scope?: string;
}

export default Tokens;
