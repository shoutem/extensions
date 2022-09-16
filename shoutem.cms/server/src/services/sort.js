import _ from 'lodash';
import { getStatus } from '@shoutem/redux-io/status';

export function getCurrentSortFromCollection(collection) {
  const status = getStatus(collection);
  return _.get(status, 'params.sort');
}

export function getSortFromSortOptions(sortOptions) {
  if (!sortOptions) {
    return null;
  }

  const { field, order } = sortOptions;

  // when previewing distance (location) sort in builder,
  // we fallback to alphabetical name sort (we can't preview
  // distance sort without users location)
  if (field === 'location') {
    return 'name';
  }

  return order === 'ascending' ? field : `-${field}`;
}
