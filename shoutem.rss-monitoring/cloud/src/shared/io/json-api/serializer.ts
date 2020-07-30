import _ from 'lodash';
import bluebird from 'bluebird';
import JSONAPISerializer from 'json-api-serializer';

/* eslint-disable @typescript-eslint/no-explicit-any */

class RelationshipResolver {
  public resourceCache: object;

  public relationshipCache: object;

  public schemas: object;

  public loaders: object;

  public relationshipLoaders: object;

  constructor(schemas, loaders, relationshipLoaders) {
    this.resourceCache = {};
    this.relationshipCache = {};
    this.schemas = schemas;
    this.loaders = loaders;
    this.relationshipLoaders = relationshipLoaders;
  }

  async _resolveResourceValue(type, id) {
    // Cache first
    const cacheKey = `${type}.${id}`;
    let value = _.get(this.resourceCache, cacheKey);

    // Use loader if cache is missed
    if (!value) {
      const loader = this.loaders[type] || (() => null);
      value = await loader(id);
      if (value) {
        _.set(this.resourceCache, cacheKey, value);
      }
    }

    return value;
  }

  async _resolveRelationshipValue(type, resource, relationshipName) {
    // Cache first
    const cacheKey = `${type}.${resource.id}.${relationshipName}`;
    let value = _.get(this.relationshipCache, cacheKey);

    // Use loader if cache is missed
    if (!value) {
      const loader = _.get(this.relationshipLoaders, `${type}.${relationshipName}`) || (() => null);
      value = await loader(resource);
      if (value) {
        _.set(this.relationshipCache, cacheKey, value);
      }
    }

    return value;
  }

  async _excludeRelationship(data, name, relationshipDef) {
    const value = _.get(data, name);
    const idName = _.get(this.schemas, `${relationshipDef.type}.default.id`);
    if (_.isArray(value)) {
      data[name] = _.map(value, (v) => {
        if (_.isObject(v)) {
          return v[idName];
        }
        return v;
      });
    } else if (_.isObject(value)) {
      data[name] = _.get(data, `${name}.${idName}`);
    }
  }

  async _includeRelationship(data, name, relationshipDef) {
    const value = _.get(data, name) || _.get(data, relationshipDef.alternativeKey);
    if (_.isArray(value)) {
      data[name] = await Promise.all(
        _.map(value, async (v) => {
          if (_.isObject(v)) {
            return v;
          }
          return (await this._resolveResourceValue(relationshipDef.type, v)) || v;
        }),
      );
    } else if (_.isObject(value)) {
      // NOOP
    } else {
      data[name] = (await this._resolveResourceValue(relationshipDef.type, value)) || value;
    }
  }

  async prepareRelationships(type, data, include) {
    if (_.isArray(data)) {
      await bluebird.each(data, async (item) => {
        await this.prepareRelationships(type, item, include);
      });

      return;
    }

    if (_.isObject(data)) {
      const relationshipDefs = _.get(this.schemas, `${type}.default.relationships`);
      await bluebird.each(_.keys(relationshipDefs), async (relationshipName) => {
        const relationshipDef = relationshipDefs[relationshipName];
        const relationshipValue = _.get(data, relationshipName) || _.get(data, relationshipDef.alternativeKey);
        if (_.isUndefined(relationshipValue)) {
          data[relationshipName] = await this._resolveRelationshipValue(type, data, relationshipName);
        }
        if (_.get(include, relationshipName)) {
          await this._includeRelationship(data, relationshipName, relationshipDef);
          await this.prepareRelationships(relationshipDef.type, data[relationshipName], include[relationshipName]);
        } else {
          await this._excludeRelationship(data, relationshipName, relationshipDef);
        }
      });
    }
  }
}

export class XJsonApiSerializer {
  public serializer: any;

  public loaders: any;

  public relationshipLoaders: any;

  public transforms: any;

  public virtuals: any;

  constructor(defaultOptions) {
    this.serializer = new JSONAPISerializer(defaultOptions);
    this.loaders = {};
    this.relationshipLoaders = {};
    this.transforms = {};
    this.virtuals = {};
  }

  _escapeType(type) {
    return type.replace(/\./g, '__dot__');
  }

  _unescapeType(type) {
    return type.replace(/__dot__/g, '.');
  }

  _unescapeTypesInObject(object) {
    if (_.isArray(object)) {
      _.forEach(object, (item) => this._unescapeTypesInObject(item));
    } else if (_.isObject(object)) {
      _.forEach(object, (value, key) => {
        if (key === 'type' && _.isString(value)) {
          object[key] = this._unescapeType(value);
        }

        this._unescapeTypesInObject(value);
      });
    }
  }

  _escapeTypesInObject(object) {
    if (_.isArray(object)) {
      _.forEach(object, (item) => this._escapeTypesInObject(item));
    } else if (_.isObject(object)) {
      _.forEach(object, (value, key) => {
        if (key === 'type' && _.isString(value)) {
          object[key] = this._escapeType(value);
        }

        this._escapeTypesInObject(value);
      });
    }
  }

  async _transformData(type, data, req) {
    if (_.isArray(data)) {
      return Promise.all(_.map(data, (item) => this._transformData(type, item, req)));
    }

    if (_.isObject(data)) {
      // Explicit transform
      const transformFn = _.get(this.transforms, type);
      const transformedData = transformFn ? await transformFn(data, req) : data;

      // Virtual properties
      const virtuals = _.get(this.virtuals, type);
      await bluebird.each(_.keys(virtuals), async (virtualName) => {
        const virtualDef = virtuals[virtualName];
        if (_.isFunction(virtualDef)) {
          transformedData[virtualName] = await virtualDef(transformedData);
        } else {
          transformedData[virtualName] = virtualDef;
        }
      });

      // Recursively transform related resources
      const relationshipDefs = _.get(this.serializer.schemas, `${type}.default.relationships`);
      await bluebird.each(_.keys(relationshipDefs), async (relationshipName) => {
        const relationshipDef = relationshipDefs[relationshipName];
        const relationshipData = _.get(transformedData, relationshipName);
        if (relationshipData) {
          transformedData[relationshipName] = await this._transformData(relationshipDef.type, relationshipData, req);
        }
      });

      return transformedData;
    }

    return data;
  }

  register(type, options) {
    const escapedType = this._escapeType(type);
    const libOptions = _.cloneDeep(options || {});
    if (libOptions.load) {
      this.loaders[escapedType] = libOptions.load;
      delete libOptions.load;
    }

    if (libOptions.transform) {
      this.transforms[escapedType] = libOptions.transform;
      delete libOptions.transform;
    }

    if (libOptions.virtuals) {
      this.virtuals[escapedType] = libOptions.virtuals;
      delete libOptions.virtuals;
    }

    _.forEach(libOptions.relationships, (def, name) => {
      def.type = this._escapeType(def.type);
      if (def.load) {
        _.set(this.relationshipLoaders, `${escapedType}.${name}`, def.load);
        delete def.load;
      }
    });

    this.serializer.register(escapedType, libOptions);
  }

  async serialize(type, data, extraData, xOptions, req) {
    const escapedType = this._escapeType(type);
    const includeArray = _.get(xOptions, 'include') || [];
    const includeObj = {};
    _.forEach(includeArray, (includeItem) => {
      _.merge(includeObj, _.set({}, includeItem, {}));
    });

    let preparedData = _.cloneDeep(data);
    const relationshipResolver = new RelationshipResolver(
      this.serializer.schemas,
      this.loaders,
      this.relationshipLoaders,
    );

    // Resolve relationships
    await relationshipResolver.prepareRelationships(escapedType, preparedData, includeObj);

    // Perform transformations
    preparedData = await this._transformData(escapedType, preparedData, req);

    const serializedData = await this.serializer.serializeAsync(escapedType, preparedData, extraData);
    this._unescapeTypesInObject(serializedData);

    return serializedData;
  }

  async deserialize(type, data) {
    const escapedType = await this._escapeType(type);
    const escapedData = _.cloneDeep(data);
    this._escapeTypesInObject(escapedData);

    return this.serializer.deserializeAsync(escapedType, escapedData);
  }

  getTypeIdName(type) {
    return _.get(this.serializer, `schemas.${this._escapeType(type)}.default.id`);
  }
}
