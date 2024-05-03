import _ from 'lodash';
import { create, find, invalidate, remove, update } from '@shoutem/redux-io';
import { CATEGORIES } from '../const';
import { getResourceRelationships, shoutemUrls } from '../services';

// ACTIONS
export function loadResources(
  appId,
  categoryId,
  schema,
  tag,
  filter = {},
  scope = {},
) {
  const categoryQuery = categoryId
    ? {
        'filter[categories]': categoryId,
      }
    : {};

  const params = {
    q: {
      ...categoryQuery,
      ...filter,
    },
    ...scope,
  };

  const config = {
    schema,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `/v1/apps/${appId}/resources/${schema}{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, tag, params);
}

export function loadResource(appId, schema, resourceId, scope = {}) {
  const config = {
    schema,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `/v1/apps/${appId}/resources/${schema}/${resourceId}{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const params = {
    ...scope,
  };

  return find(config, `resource-${resourceId}`, params);
}

export function deleteResource(appId, resourceId, schema, scope = {}) {
  const config = {
    schema,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `/v1/apps/${appId}/resources/${schema}/${resourceId}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const resource = {
    type: schema,
    id: resourceId,
  };

  return remove(config, resource, scope);
}

export function createResource(
  appId,
  categoryIds = [],
  schema,
  resource,
  relatedResources = {},
  scope = {},
) {
  const config = {
    schema,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `/v1/apps/${appId}/resources/${schema}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const categoriesRelationship = !_.isEmpty(categoryIds)
    ? {
        categories: {
          data: _.map(categoryIds, categoryId => ({
            type: CATEGORIES,
            id: categoryId,
          })),
        },
      }
    : {};

  const resourceToCreate = {
    type: schema,
    attributes: resource,
    relationships: {
      ...categoriesRelationship,
      ...relatedResources,
    },
  };

  return create(config, resourceToCreate, scope);
}

export function updateResource(
  appId,
  categoryIds,
  schema,
  resource,
  relatedResources = {},
  scope = {},
) {
  const { id: resourceId } = resource;

  const config = {
    schema,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `/v1/apps/${appId}/resources/${schema}/${resourceId}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const categoriesRelationship = !_.isEmpty(categoryIds)
    ? {
        categories: {
          data: _.map(categoryIds, categoryId => ({
            type: CATEGORIES,
            id: categoryId,
          })),
        },
      }
    : {};

  const resourceToUpdate = {
    type: schema,
    id: resourceId,
    attributes: resource,
    relationships: {
      ...categoriesRelationship,
      ...relatedResources,
    },
  };

  return update(config, resourceToUpdate, scope);
}

export function updateResourceCategories(
  appId,
  categoryIds,
  resource,
  scope = {},
) {
  const { type: schema } = resource;
  const resourceRelationships = getResourceRelationships(resource);

  // omit all relationship keys from resource - they have to be added as relationships to request
  const rawResource = _.omit(resource, _.keys(resourceRelationships));

  // omit `application` and `categories` relationships
  // application is unnecessary, categories are about to be updated
  const relatedResources = _.omit(resourceRelationships, [
    'categories',
    'application',
  ]);

  return updateResource(
    appId,
    categoryIds,
    schema,
    rawResource,
    relatedResources,
    scope,
  );
}

export function updateResourceLanguages(
  appId,
  languageIds,
  resource,
  scope = {},
) {
  return dispatch => {
    const resourceId = _.get(resource, 'id');
    const schema = _.get(resource, 'type');

    const resourceLanguages = _.get(resource, 'channels');
    const resourceLanguageIds = _.map(resourceLanguages, language =>
      _.get(language, 'id'),
    );

    const toggleLanguageIds = _.xor(resourceLanguageIds, languageIds);

    // TODO: implement channels with json-api
    const config = {
      schema: 'legacy-channels',
      request: {
        endpoint: shoutemUrls.buildLegacyUrl(
          `${appId}/channels/fn/toggleChannel`,
        ),
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
        },
      },
    };

    // modelTypeId represents entity type in legacy API
    const promises = [];
    _.forEach(toggleLanguageIds, channelId => {
      const params = {
        modelTypeId: '5344b5e0-e0ba-46f7-b529-2c460e28df73',
        entityId: resourceId,
        channelId,
      };

      promises.push(dispatch(find(config, 'toggle-channel', params)));
    });

    return Promise.all(promises).then(() =>
      dispatch(loadResource(appId, schema, resourceId, scope)),
    );
  };
}

export function updateResourceIndex(appId, categoryId, index, resource) {
  return dispatch => {
    const { id: resourceId } = resource;
    const schema = _.get(resource, 'type');

    const item = {
      data: {
        type: 'shoutem.core.resources.move-to-index-actions',
        attributes: { index },
        relationships: {
          category: {
            data: {
              type: CATEGORIES,
              id: categoryId,
            },
          },
        },
      },
    };

    const config = {
      schema: 'shoutem.core.resources.move-to-index-actions',
      request: {
        endpoint: shoutemUrls.buildLegacyUrl(
          `/v1/apps/${appId}/resources/${schema}/${resourceId}/actions/move-to-index`,
        ),
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify(item),
      },
    };

    return dispatch(find(config, 'move-to-index')).then(() => {
      dispatch(invalidate(schema));
    });
  };
}
