import _ from 'lodash';
import { RSAA } from 'redux-api-middleware';
import { setShortcutScope, setExtensionScope } from '@shoutem/redux-api-sdk';
import { find, remove, invalidate } from '@shoutem/redux-io';
import { shoutemUrls, rsaaPromise } from '../services';
import { CATEGORIES } from '../const';

export function loadCategories(
  appId,
  parentCategoryId,
  schema,
  tag,
  filter = {},
  scope = {},
) {
  const params = {
    q: {
      'filter[parent]': parentCategoryId,
      'filter[schema]': schema,
      ...filter,
    },
    ...scope,
  };

  const config = {
    schema: CATEGORIES,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/categories{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, tag, params);
}

export function deleteCategory(appId, categoryId, scope = {}) {
  const config = {
    schema: CATEGORIES,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `/v1/apps/${appId}/categories/${categoryId}`,
      ),
      headers: {},
    },
  };

  const user = { type: CATEGORIES, id: categoryId };
  return remove(config, user, scope);
}

// TODO this should be on new API - not supported yet
export function createCategory(
  appId,
  schema,
  categoryName,
  parentCategoryId,
  scope = {},
) {
  return dispatch => {
    const cmsEndpoint = parentCategoryId
      ? `/api/modules/0/groups/${parentCategoryId}/sections/create`
      : '/api/modules/0/groups/create';

    const endpoint = shoutemUrls.buildLegacyUrl(
      `${cmsEndpoint}?nid=${appId}&version=58`,
    );

    const createCategoryAction = {
      [RSAA]: {
        endpoint,
        method: 'POST',
        body: JSON.stringify({
          name: categoryName,
          schema,
        }),
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        types: [
          '@@cms-dashboard/CREATE_CATEGORY_REQUEST',
          '@@cms-dashboard/CREATE_CATEGORY_SUCCESS',
          '@@cms-dashboard/CREATE_CATEGORY_ERROR',
        ],
      },
    };

    const extensionName = _.get(scope, 'extensionName');
    if (extensionName) {
      setExtensionScope(createCategoryAction, extensionName);
    }

    const shortcutId = _.get(scope, 'shortcutId');
    if (shortcutId) {
      setShortcutScope(createCategoryAction, shortcutId);
    }

    return dispatch(rsaaPromise(createCategoryAction)).then(category => {
      dispatch(invalidate(CATEGORIES));
      return category;
    });
  };
}

export function renameCategory(
  appId,
  parentCategoryId,
  categoryId,
  categoryName,
  scope = {},
) {
  return dispatch => {
    const cmsEndpoint = `/api/modules/0/groups/${parentCategoryId}/sections/${categoryId}/update`;
    const endpoint = shoutemUrls.buildLegacyUrl(
      `${cmsEndpoint}?nid=${appId}&version=58`,
    );

    const createCategoryAction = {
      [RSAA]: {
        endpoint,
        method: 'POST',
        body: JSON.stringify({
          name: categoryName,
        }),
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        types: [
          '@@cms-dashboard/UPDATE_CATEGORY_REQUEST',
          '@@cms-dashboard/UPDATE_CATEGORY_SUCCESS',
          '@@cms-dashboard/UPDATE_CATEGORY_ERROR',
        ],
      },
    };

    const extensionName = _.get(scope, 'extensionName');
    if (extensionName) {
      setExtensionScope(createCategoryAction, extensionName);
    }

    const shortcutId = _.get(scope, 'shortcutId');
    if (shortcutId) {
      setShortcutScope(createCategoryAction, shortcutId);
    }

    return dispatch(rsaaPromise(createCategoryAction)).then(category => {
      dispatch(invalidate(CATEGORIES));
      return category;
    });
  };
}

export function dragAndDropCategory(
  appId,
  parentCategoryId,
  categoryId,
  index,
  scope = {},
) {
  return dispatch => {
    const cmsEndpoint = `/api/modules/0/groups/${parentCategoryId}/sections/${categoryId}/update`;
    const endpoint = shoutemUrls.buildLegacyUrl(
      `${cmsEndpoint}?nid=${appId}&version=58`,
    );

    const createCategoryAction = {
      [RSAA]: {
        endpoint,
        method: 'POST',
        body: JSON.stringify({
          index,
        }),
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        types: [
          '@@cms-dashboard/UPDATE_CATEGORY_REQUEST',
          '@@cms-dashboard/UPDATE_CATEGORY_SUCCESS',
          '@@cms-dashboard/UPDATE_CATEGORY_ERROR',
        ],
      },
    };

    const extensionName = _.get(scope, 'extensionName');
    if (extensionName) {
      setExtensionScope(createCategoryAction, extensionName);
    }

    const shortcutId = _.get(scope, 'shortcutId');
    if (shortcutId) {
      setShortcutScope(createCategoryAction, shortcutId);
    }

    return dispatch(rsaaPromise(createCategoryAction)).then(category => {
      dispatch(invalidate(CATEGORIES));
      return category;
    });
  };
}
