import _ from 'lodash';
import { find, next, prev } from '@shoutem/redux-io';
import { url, appId } from 'environment';
import { ext } from 'context';
import { getSortFromSortOptions } from '../services';
import { CURRENT_SCHEMA } from '../types';

export function resolveSortParam(sortOptions) {
  const sort = getSortFromSortOptions(sortOptions);
  if (!sort) {
    return null;
  }

  return { sort };
}

function resolveIncludeParam(include = {}) {
  if (_.isEmpty(include)) {
    return {};
  }

  return { include };
}

function resolveSearchParams(searchOptions = {}) {
  const params = {};

  if (_.isEmpty(searchOptions)) {
    return params;
  }

  if (searchOptions.query) {
    _.set(params, 'query', searchOptions.query);
  }

  _.forEach(searchOptions.filters, filter => {
    if (filter) {
      if (filter.operator && filter.operator !== 'eq') {
        params[`filter[${filter.name}][${filter.operator}]`] = filter.value;
      } else {
        params[`filter[${filter.name}]`] = filter.value;
      }
    }
  });

  return params;
}

export function loadResources(
  schema = CURRENT_SCHEMA,
  parentCategoryId,
  sortOptions,
  include,
  limit,
  offset,
  searchOptions,
) {
  const queryParams = {
    ...resolveSortParam(sortOptions),
    ...resolveIncludeParam(include),
    ...resolveSearchParams(searchOptions),
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

export function loadNextResourcesPage(resources, append = false) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return next(resources, append, config);
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

export function fetchCmsDataZip(appId, categoryId) {
  const filter = `filter[categories]=${categoryId}`;
  const endpoint = `//${url.apps}/v1/apps/${appId}/resources/${CURRENT_SCHEMA}/actions/export?${filter}`;
  const config = {
    method: 'POST',
    headers: { Accept: 'application/zip' },
  };

  return fetch(endpoint, config).then(response => response.blob());
}
