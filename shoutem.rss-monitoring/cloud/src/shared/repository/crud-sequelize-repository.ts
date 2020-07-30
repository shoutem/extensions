import _ from 'lodash';
import bluebird from 'bluebird';
import { Model } from 'sequelize-typescript';
import { lean, mapIoSortToSequelizeSort } from '../db';
import { mapIoFilterToSequelizeFilter } from '../db/services';
import { leanPage } from '../db/lean-decorator';
import { PagedCollection } from '../paging/paged-collection';

/* eslint-disable @typescript-eslint/no-explicit-any */

enum AssociationTypes {
  BELONGS_TO = 'BelongsTo',
  BELONGS_TO_MANY = 'BelongsToMany',
  HAS_MANY = 'HasMany',
}

const nonAutomaticAssociationTypes = [
  AssociationTypes.BELONGS_TO,
  AssociationTypes.BELONGS_TO_MANY,
  AssociationTypes.HAS_MANY,
];

const manyTypeAssociations = [AssociationTypes.BELONGS_TO_MANY, AssociationTypes.HAS_MANY];

/**
 * Repository providing basic CRUD operations for Sequelize model.
 * Optional features like include can be turned on and customized via options.
 */
export class CrudSequelizeRepository<T extends Model<T>> {
  public Model!: T;

  public options?: any;

  protected invokableModel!: any;

  /**
   * Constructor
   * @param Model Sequelize data model
   * @param options Object which can contain:
   *  - 'include' array of objects, include option description:
   *  http://docs.sequelizejs.com/manual/tutorial/models-usage.html#top-level-where-with-eagerly-loaded-models
   */
  // new () => T symbolizes receiving a class type whose static methods can then be called
  constructor(modelType: new () => T, options = {}) {
    this.invokableModel = modelType;
    this.options = options;
  }

  @lean
  async getAll(sort = ['id']): Promise<T[]> {
    try {
      return this.invokableModel.findAll({
        include: this.options.include,
        order: mapIoSortToSequelizeSort(sort),
      });
    } catch (err) {
      throw err;
    }
  }

  @lean
  async find(filter, sort = ['id']): Promise<T[]> {
    return this.invokableModel.findAll({
      include: this.options.include,
      order: mapIoSortToSequelizeSort(sort),
      where: mapIoFilterToSequelizeFilter(filter),
    });
  }

  @lean
  async findOne(filter: object): Promise<T> {
    const item = await this.invokableModel.findOne({
      where: filter,
      include: this.options.include,
    });

    return item;
  }

  @leanPage
  async findPage(filter, sort = ['id'], page): Promise<PagedCollection<T>> {
    const pageOptions = {
      offset: 0,
      limit: 20,
      ...page,
    };

    const result = await this.invokableModel.findAll({
      include: this.options.include,
      offset: pageOptions.offset,
      limit: pageOptions.limit + 1,
      order: mapIoSortToSequelizeSort(sort),
      where: mapIoFilterToSequelizeFilter(filter),
    });

    return PagedCollection.createFromNPlus1Result<T>(result, pageOptions);
  }

  @leanPage
  async findPageAndCountAll(filter, sort = ['id'], page = { offset: 0, limit: 20 }): Promise<PagedCollection<T>> {
    const result = await this.invokableModel.findAndCountAll({
      include: this.options.include,
      offset: page.offset,
      limit: page.limit + 1,
      order: mapIoSortToSequelizeSort(sort),
      where: mapIoFilterToSequelizeFilter(filter),
    });

    return PagedCollection.createFromNPlus1CountAllResult<T>(result.rows, result.count, page);
  }

  @lean
  async get(id: string | number): Promise<T> {
    const item = await this.invokableModel.findByPk(id, { include: this.options.include });

    return item;
  }

  @lean
  async getByIds(ids: string[] | number[]): Promise<T[]> {
    const result = await this.invokableModel.findAll({
      where: { id: { $in: ids } },
      include: this.options.include,
    });

    const items = _.map(ids, (id) => _.find(result, ['id', id]));

    return items;
  }

  @lean
  async create(data: any): Promise<T> {
    const createdModel = await this.invokableModel.create(data);

    await this.updateAssociations(createdModel, data);

    const item = await this.get(createdModel.id);

    return item;
  }

  @lean
  async update(id: string | number, data): Promise<T> {
    if (!_.isNil(data.id)) {
      data.id = id;
    }

    await this.invokableModel.update(data, { where: { id } });
    const updatedModel = await this.invokableModel.findByPk(id);

    await this.updateAssociations(updatedModel, data);
    const item = await this.get(id);

    return item;
  }

  async remove(id: string | number) {
    const model = await this.invokableModel.findByPk(id);
    const manyToManyAssociations = _.filter(
      this.invokableModel.associations,
      (assoc) => assoc.associationType === 'BelongsToMany',
    );

    // remove associations that would otherwise break constraints
    await bluebird.map(manyToManyAssociations, async (assoc) => {
      const name = assoc.associationAccessor;

      const updateMethodName = `set${_.upperFirst(_.camelCase(name))}`;
      // eslint-disable-next-line prefer-spread
      await model[updateMethodName].apply(model, [[]]);
    });

    return this.invokableModel.destroy({ where: { id } });
  }

  async updateAssociations(existingModel: T, data) {
    // for associations of the model that are not added automatically during sequelize create/update
    // fill up this array with association data specified in 'data'
    const presentAssociationData: {
      associationName: string;
      associationValue: string;
      associationType: AssociationTypes;
    }[] = [];

    _.forOwn(this.invokableModel.associations, (association, associationName) => {
      if (
        !_.isEmpty(data[associationName]) &&
        nonAutomaticAssociationTypes.indexOf(association.associationType) !== -1
      ) {
        presentAssociationData.push({
          associationName,
          associationType: association.associationType,
          associationValue: data[associationName],
        });
      }
    });

    // for each of the above associations, dynamically add it with sequelize's set`${AssociationName}` method
    await bluebird.each(presentAssociationData, async (association) => {
      const name = association.associationName;
      const value = data[name];

      const updateMethod = this.resolveAssociationMethod(association.associationName, association.associationType);

      return this.updateAssociation(existingModel, updateMethod, value);
    });
  }

  private resolveAssociationMethod(associationName: string, associationType: AssociationTypes) {
    const baseName = `${_.upperFirst(_.camelCase(associationName))}`;

    if (_.includes(manyTypeAssociations, associationType)) {
      const sequelizeMethod = `set${baseName}`;
      // eslint-disable-next-line prefer-spread
      return (existingModel: Model<T>, values) => existingModel[sequelizeMethod].apply(existingModel, values);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    return (existingModel: Model<T>, values) => `add${baseName}`;
  }

  private updateAssociation(existingModel: T, updateMethod, value: any) {
    return updateMethod(existingModel, [value]);
  }
}
