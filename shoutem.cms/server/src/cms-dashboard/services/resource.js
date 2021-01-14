import _ from 'lodash';
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

function createResourceRelationship(appId, schema, key, value) {
  return async dispatch => {
    const response = await dispatch(createResource(appId, null, schema, value));

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

function updateResourceRelationship(appId, schema, key, value) {
  return async dispatch => {
    const response = await dispatch(updateResource(appId, null, schema, value));

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

function updateResourceRelationships(appId, schema, resource, initialResource) {
  return async dispatch => {
    let relationships = {};
    const promises = [];

    const include = getIncludeProperties(schema);

    _.forEach(include, key => {
      const referencedSchema = getReferencedSchema(schema, key);

      // TODO: support multiple relationshsips, check if value is an array
      const value = _.get(resource, key);
      const initialValue = _.get(initialResource, key);
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
              updateResourceRelationship(appId, referencedSchema, key, value),
            ),
          );
        } else {
          const relationship = { data: { id, type: referencedSchema } };
          _.set(relationships, key, relationship);
        }
      } else {
        if (!_.isEmpty(value) && !isEntityReference) {
          promises.push(
            dispatch(
              createResourceRelationship(appId, referencedSchema, key, value),
            ),
          );
        } else {
          const relationship = { data: { id, type: referencedSchema } };
          _.set(relationships, key, relationship);
        }
      }

      // remove referenced item from attributes
      _.unset(resource, key);
    });

    const values = await Promise.all(promises);
    _.forEach(values, relationship => {
      relationships = _.merge(relationships, relationship);
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
