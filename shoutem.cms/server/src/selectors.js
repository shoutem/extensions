import _ from 'lodash';
import { ext } from 'context';
import { denormalizeCollection, denormalizeItem } from 'denormalizer';
import { isInitialized } from '@shoutem/redux-io';
import { createSelector } from 'reselect';
import { CATEGORIES, CHANNELS, SCHEMAS, CURRENT_SCHEMA } from './types';

export function getCmsState(state) {
  return state[ext()].cmsPage;
}

export function getCategories(state, tag = 'all') {
  const cmsState = getCmsState(state);
  const categories = _.get(cmsState, ['categories', tag]);
  return denormalizeCollection(categories, undefined, CATEGORIES);
}

export function getLanguages(state) {
  const cmsState = getCmsState(state);
  const languages = _.get(cmsState, 'languages');
  return denormalizeCollection(languages, undefined, CHANNELS);
}

export function getRawLanguages(state) {
  const cmsState = getCmsState(state);
  const languages = getLanguages(state);
  const rawChannelsPayload = _.get(cmsState, 'rawChannels');
  const rawChannels = _.get(rawChannelsPayload, 'data');

  const filteredLanguages = _.filter(rawChannels, rawChannel => {
    const id = _.get(rawChannel, 'id');

    if (_.find(languages, { id })) {
      return rawChannel;
    }
  });

  return filteredLanguages;
}

export function getSchema(state) {
  const cmsState = getCmsState(state);
  return denormalizeItem(cmsState.schema, undefined, SCHEMAS);
}

export function getResources(state) {
  const cmsState = getCmsState(state);
  return denormalizeCollection(cmsState.resources, undefined, CURRENT_SCHEMA);
}

export const dataInitialized = shortcut =>
  createSelector(
    getCategories,
    getSchema,
    getResources,
    (categories, schema, resources) => {
      const shortcutSettings = shortcut.settings || {};
      const { parentCategory } = shortcutSettings;

      const resourcesInitialized = !parentCategory || isInitialized(resources);
      return (
        resourcesInitialized &&
        isInitialized(categories) &&
        isInitialized(schema)
      );
    },
  );
