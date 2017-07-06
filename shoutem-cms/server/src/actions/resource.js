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

  return order === 'ascending' ?
    { sort: field } :
    { sort: `-${field}` };
}

function resolveCategoryParam(categoryId) {
  return {
    'filter[categories]': categoryId,
  };
}


export function loadResources(categoryId, sortOptions) {
  const queryParams = {
    ...resolveCategoryParam(categoryId),
    ...resolveSortParam(sortOptions),
  };

  const config = {
    schema: CURRENT_SCHEMA,
    request: {
      endpoint: `//${url.legacy}/v1/apps/${appId}/resources/${CURRENT_SCHEMA}`,
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('all'), queryParams);
}
