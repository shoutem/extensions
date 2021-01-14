import _ from 'lodash';
import { find, next, prev } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { ext } from 'context';
import { CURRENT_SCHEMA } from '../types';

function resolveSortParam(sortOptions) {
  if (!sortOptions) {
    return null;
  }

  const { field, order } = sortOptions;

  // when previewing distance (location) sort in builder,
  // we fallback to alphabetical name sort (we can't preview
  // distance sort without users location)
  if (field === 'location') {
    return { sort: 'name' };
  }

  return order === 'ascending' ? { sort: field } : { sort: `-${field}` };
}

function resolveIncludeParam(include = {}) {
  if (_.isEmpty(include)) {
    return {};
  }

  return { include: include };
}

export function loadResources(
  schema = CURRENT_SCHEMA,
  parentCategoryId,
  sortOptions,
  include,
  limit,
  offset,
) {
  const queryParams = {
    ...resolveSortParam(sortOptions),
    ...resolveIncludeParam(include),
    'filter[categories]': parentCategoryId,
    'page[limit]': limit,
    'page[offset]': offset,
  };

  const config = {
    schema,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/resources/${schema}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('all'), queryParams);
}

export function loadReferenceResources(schema) {
  const queryParams = {
    'page[limit]': 10000,
  };

  const config = {
    schema,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/resources/${schema}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('reference-resources'), queryParams);
}

export function loadNextResourcesPage(resources) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return next(resources, false, config);
}

export function loadPreviousResourcesPage(resources) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return prev(resources, false, config);
}
