import {
  Column,
  DataType,
  Model,
  Table,
  AllowNull,
} from 'sequelize-typescript';

@Table({ modelName: 'Tokens' })
export class Tokens extends Model<Tokens> {
  @AllowNull(false)
  @Column(DataType.STRING)
  appId?: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  access_token?: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  refresh_token?: string;

  @Column(DataType.INTEGER)
  expires_in?: number;

  @Column(DataType.STRING)
  token_type?: string;

  @Column(DataType.STRING)
  rest_instance_url?: string;

  @Column(DataType.STRING)
  soap_instance_url?: string;

  @Column(DataType.TEXT)
  scope?: string;
}

export default Tokens;
