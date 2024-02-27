import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  BelongsToMany,
  HasOne,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';

{=#associations=}
import { {=relatedModelGetter=} } from '../../{=relatedModuleName=}/data/{=relatedModuleName=}-model';
{=/associations=}

@Table({ modelName: '{=modelName.pascalCasePlural=}' })
export class {=modelName.pascalCase=} extends Model<{=modelName.pascalCase=}> {
  {=#properties=}
  @Column(DataType.{=sequelizeType=})
  {=name=}?: {=jsType=};

  {=/properties=}
  {=#associations=}
  @{=associationType=}(() => {=relatedModelGetter=})
  {=name=}?: {=jsType=};

  {=/associations=}
  {=#foreignKeys=}
  @ForeignKey(() => {=model=})
  @Column(DataType.INTEGER)
  {=name=}?: number;

  {=/foreignKeys=}
  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default {=modelName.pascalCase=};
