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
  iosBinaryVersionName?: string;

  @Column(DataType.INTEGER)
  iosBinaryVersionCode?: number;

  @Column(DataType.INTEGER)
  iosBundleVersionCode?: number;

  @Column(DataType.STRING)
  iosBundleUrl?: string;

  @Column(DataType.STRING)
  androidBinaryVersionName?: string;

  @Column(DataType.INTEGER)
  androidBinaryVersionCode?: number;

  @Column(DataType.INTEGER)
  androidBundleVersionCode?: number;

  @Column(DataType.STRING)
  androidBundleUrl?: string;

  @Column(DataType.STRING)
  previewIosBundleUrl?: string;

  @Column(DataType.STRING)
  previewAndroidBundleUrl?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default App;
