import _ from 'lodash';
import { find } from '@shoutem/redux-io';
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

function resolveCategoryParam(parentCategoryId, visibleCategoryIds = []) {
  const categoryFilter = _.isEmpty(visibleCategoryIds)
    ? parentCategoryId
    : _.join(visibleCategoryIds);

  return {
    'filter[categories]': categoryFilter,
  };
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
  visibleCategoryIds,
  sortOptions,
  include,
) {
  const queryParams = {
    ...resolveCategoryParam(parentCategoryId, visibleCategoryIds),
    ...resolveSortParam(sortOptions),
    ...resolveIncludeParam(include),
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
