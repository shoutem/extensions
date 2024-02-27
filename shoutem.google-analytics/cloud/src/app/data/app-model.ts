import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ modelName: 'Apps' })
export class App extends Model<App> {
  @Column(DataType.STRING)
  appId?: string;

  @Column(DataType.STRING)
  propertyId?: string;

  @Column(DataType.STRING)
  serviceAccountKeyJson?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default App;
