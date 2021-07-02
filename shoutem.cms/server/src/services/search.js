import _ from 'lodash';
import { getCollectionParams } from '@shoutem/redux-io/reducers/collection';
import { getFilterableSchemaKeys } from '@shoutem/cms-dashboard';
import { SEARCH_CAPABILITIES } from '../const';

export function canSearch(shortcut) {
  return _.includes(shortcut.capabilities, SEARCH_CAPABILITIES.SEARCH);
}

export function canFilter(shortcut) {
  return _.includes(shortcut.capabilities, SEARCH_CAPABILITIES.FILTER);
}

export function getCurrentSearchOptionsFromCollection(schema, collection) {
  const filterableKeys = getFilterableSchemaKeys(schema);
  const params = getCollectionParams(collection);
  const searchOptions = {};

  if (_.has(params, 'query')) {
    _.set(searchOptions, 'query', params.query);
  }

  const filters = _.compact(
    _.map(params, (value, key) => {
      if (!_.startsWith(key, 'filter')) {
        return null;
      }

      const matches = key.match(/([^[]+(?=]))/g);
      if (matches && matches.length === 0) {
        return null;
      }

      const name = _.get(matches, '[0]');
      if (!_.includes(filterableKeys, name)) {
        return null;
      }

      const operator = _.get(matches, '[1]', 'eq');

      return {
        name,
        operator,
        value,
      };
    }),
  );

  if (!_.isEmpty(filters)) {
    _.set(searchOptions, 'filters', filters);
  }

  return searchOptions;
}
