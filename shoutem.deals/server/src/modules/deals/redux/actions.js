import {
  loadResources,
  deleteResource,
  createResource,
  updateResource,
  loadCategories,
  createCategory,
} from '@shoutem/cms-dashboard';
import { next, prev } from '@shoutem/redux-io';
import { ext } from 'src/const';
import { types } from 'src/services';
import { DEFAULT_OFFSET, DEFAULT_LIMIT, MAX_PAGE_LIMIT } from '../const';

export function loadDeals(
  appId,
  categoryId,
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  scope = {},
) {
  const filter = {
    'page[limit]': limit,
    'page[offset]': offset,
    sort: 'id',
  };

  return loadResources(
    appId,
    [categoryId],
    types.DEALS,
    ext('deals'),
    filter,
    scope,
  );
}

export function loadNextDealsPage(deals) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return next(deals, false, config);
}

export function loadPreviousDealsPage(deals) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return prev(deals, false, config);
}

export function deleteDeal(appId, dealId, scope = {}) {
  return deleteResource(appId, dealId, types.DEALS, scope);
}

export function createDeal(appId, categoryIds, placeId, resource, scope = {}) {
  const relatedResources = placeId
    ? {
        place: {
          data: {
            id: placeId,
            type: types.PLACES,
          },
        },
      }
    : {};

  return createResource(
    appId,
    categoryIds,
    types.DEALS,
    resource,
    relatedResources,
    scope,
  );
}

export function updateDeal(appId, categoryIds, placeId, resource, scope = {}) {
  const relatedResources = placeId
    ? {
        place: {
          data: {
            id: placeId,
            type: types.PLACES,
          },
        },
      }
    : {};

  return updateResource(
    appId,
    categoryIds,
    types.DEALS,
    resource,
    relatedResources,
    scope,
  );
}

export function loadPlaces(appId, scope = {}) {
  const filter = {
    'page[limit]': MAX_PAGE_LIMIT,
  };

  return loadResources(
    appId,
    undefined,
    types.PLACES,
    ext('places'),
    filter,
    scope,
  );
}

export function loadDealCategories(appId, parentCategoryId, scope = {}) {
  const filter = {
    'page[limit]': MAX_PAGE_LIMIT,
  };

  return loadCategories(
    appId,
    parentCategoryId,
    types.DEALS,
    ext('categories'),
    filter,
    scope,
  );
}

export function createDealCategory(appId, name, parentCategoryId, scope = {}) {
  return createCategory(appId, types.DEALS, name, parentCategoryId, scope);
}
