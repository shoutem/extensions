import _ from 'lodash';
import uuid from 'uuid-random';
import { createResource, updateResource } from '../redux';
import { PROPERTY_FORMATS } from '../const';
import {
  getIncludeProperties,
  getReferencedSchema,
  getSchemaProperty,
} from './schema';
import { calculateDifferenceObject } from './form';

function isExternalReference(element) {
  if (_.isArray(element)) {
    return isExternalReference(_.head(element));
  }

  return _.has(element, 'id') && _.has(element, 'type');
}

function transformToExternalReference(element) {
  if (_.isArray(element)) {
    return _.map(element, transformToExternalReference);
  }

  return _.pick(element, ['id', 'type']);
}

export function getResourceRelationships(resource) {
  return _.reduce(
    resource,
    (result, value, key) => {
      if (!isExternalReference(value)) {
        return result;
      }

      return {
        ...result,
        [key]: { data: transformToExternalReference(value) },
      };
    },
    {},
  );
}

function createToOneRelationship(appId, schema, key, value) {
  return async dispatch => {
    // adding uuid to avoid multiple fast requests returing as first request
    const response = await dispatch(
      createResource(appId, null, schema, value, {}, { requestId: uuid() }),
    );

    const resourceId = _.get(response, 'payload.data.id');
    const relationships = {
      [key]: {
        data: {
          id: resourceId,
          type: schema,
        },
      },
    };

    return relationships;
  };
}

function updateToOneRelationship(appId, schema, key, value) {
  return async dispatch => {
    // adding uuid to avoid multiple fast requests returing as first request
    const response = await dispatch(
      updateResource(appId, null, schema, value, {}, { requestId: uuid() }),
    );

    const resourceId = _.get(response, 'payload.data.id');
    const relationships = {
      [key]: {
        data: {
          id: resourceId,
          type: schema,
        },
      },
    };

    return relationships;
  };
}

function createToManyRelationship(appId, schema, key, value) {
  return async dispatch => {
    // adding uuid to avoid multiple fast requests returing as first request
    const response = await dispatch(
      createResource(appId, null, schema, value, {}, { requestId: uuid() }),
    );

    const resourceId = _.get(response, 'payload.data.id');
    const relationships = {
      [key]: {
        data: [
          {
            id: resourceId,
            type: schema,
          },
        ],
      },
    };

    return relationships;
  };
}

function updateToManyRelationship(appId, schema, key, value) {
  return async dispatch => {
    // adding uuid to avoid multiple fast requests returing as first request
    const response = await dispatch(
      updateResource(appId, null, schema, value, {}, { requestId: uuid() }),
    );

    const resourceId = _.get(response, 'payload.data.id');
    const relationships = {
      [key]: {
        data: [
          {
            id: resourceId,
            type: schema,
          },
        ],
      },
    };

    return relationships;
  };
}

function updateToOneRelationships(
  appId,
  schema,
  key,
  referencedSchema,
  value,
  initialValue,
) {
  return dispatch => {
    const promises = [];
    const id = _.get(value, 'id');

    const schemeProperty = getSchemaProperty(schema, key);
    const isEntityReference =
      schemeProperty.format === PROPERTY_FORMATS.ENTITY_REFERENCE;

    // if id exist that means that relationship already exist
    // no need for creating a new resource relationship
    if (id) {
      const changes = calculateDifferenceObject(value, initialValue);

      // if changes update relationship resource but only if it is not entity reference
      if (!_.isEmpty(changes) && !isEntityReference) {
        promises.push(
          dispatch(
            updateToOneRelationship(appId, referencedSchema, key, value),
          ),
        );
      } else {
        const relationships = {
          [key]: {
            data: {
              id,
              type: referencedSchema,
            },
          },
        };

        promises.push(Promise.resolve(relationships));
      }
    } else {
      if (!_.isEmpty(value) && !isEntityReference) {
        promises.push(
          dispatch(
            createToOneRelationship(appId, referencedSchema, key, value),
          ),
        );
      } else {
        const relationships = {
          [key]: {
            data: {
              id,
              type: referencedSchema,
            },
          },
        };

        promises.push(Promise.resolve(relationships));
      }
    }

    return promises;
  };
}

function updateToManyRelationships(
  appId,
  schema,
  key,
  referencedSchema,
  values,
  initialValues,
) {
  return dispatch => {
    const promises = [];

    _.forEach(values, value => {
      if (!value) {
        return;
      }

      const id = _.get(value, 'id');

      const schemeProperty = getSchemaProperty(schema, key);
      const isEntityReference =
        schemeProperty.format === PROPERTY_FORMATS.ENTITY_REFERENCE;

      // if id exist that means that relationship already exist
      // no need for creating a new resource relationship
      if (id) {
        const initialValue = _.find(initialValues, { id });
        const changes = calculateDifferenceObject(value, initialValue);

        // if changes update relationship resource but only if it is not entity reference
        if (!_.isEmpty(changes) && !isEntityReference) {
          promises.push(
            dispatch(
              updateToManyRelationship(appId, referencedSchema, key, value),
            ),
          );
        } else {
          const relationships = {
            [key]: {
              data: [
                {
                  id,
                  type: referencedSchema,
                },
              ],
            },
          };

          promises.push(Promise.resolve(relationships));
        }
      } else {
        if (!_.isEmpty(value) && !isEntityReference) {
          promises.push(
            dispatch(
              createToManyRelationship(appId, referencedSchema, key, value),
            ),
          );
        } else {
          const relationships = {
            [key]: {
              data: [
                {
                  id,
                  type: referencedSchema,
                },
              ],
            },
          };

          promises.push(Promise.resolve(relationships));
        }
      }
    });

    return promises;
  };
}

function updateResourceRelationships(appId, schema, resource, initialResource) {
  return async dispatch => {
    let relationships = {};
    const toOnePromises = [];
    const toManyPromises = [];

    const include = getIncludeProperties(schema);

    _.forEach(include, key => {
      const referencedSchema = getReferencedSchema(schema, key);
      const value = _.get(resource, key);
      const initialValue = _.get(initialResource, key);

      if (_.isArray(value)) {
        toManyPromises.push(
          ...dispatch(
            updateToManyRelationships(
              appId,
              schema,
              key,
              referencedSchema,
              value,
              initialValue,
            ),
          ),
        );
      } else {
        toOnePromises.push(
          ...dispatch(
            updateToOneRelationships(
              appId,
              schema,
              key,
              referencedSchema,
              value,
              initialValue,
            ),
          ),
        );
      }

      // remove referenced item from attributes
      _.unset(resource, key);
    });

    const toOneRelationships = await Promise.all(toOnePromises);
    _.forEach(toOneRelationships, relationship => {
      relationships = _.merge(relationships, relationship);
    });

    const toManyRelationships = await Promise.all(toManyPromises);
    _.forEach(toManyRelationships, relationship => {
      const key = _.head(_.keys(relationship));

      if (_.has(relationships, key)) {
        const data = _.get(relationship, `[${key}].data`);
        if (_.isArray(data)) {
          relationships[key].data.push(...data);
        }
      } else {
        relationships = _.merge(relationships, relationship);
      }
    });

    return relationships;
  };
}

export function createResourceWithRelationships(
  appId,
  categoryIds,
  canonicalName,
  schema,
  resource,
) {
  return async dispatch => {
    const relationships = await dispatch(
      updateResourceRelationships(appId, schema, resource),
    );

    return await dispatch(
      createResource(
        appId,
        categoryIds,
        canonicalName,
        resource,
        relationships,
      ),
    );
  };
}

export function updateResourceWithRelationships(
  appId,
  categoryIds,
  canonicalName,
  schema,
  resource,
  initialResource,
) {
  return async dispatch => {
    const relationships = await dispatch(
      updateResourceRelationships(appId, schema, resource, initialResource),
    );

    return await dispatch(
      updateResource(
        appId,
        categoryIds,
        canonicalName,
        resource,
        relationships,
      ),
    );
  };
}
