import _ from 'lodash';
import { ext } from 'context';
import { denormalizeCollection, denormalizeItem } from 'denormalizer';
import { isInitialized } from '@shoutem/redux-io';
import { getStatus, setStatus } from '@shoutem/redux-io/status';
import { createSelector } from 'reselect';
import {
  CATEGORIES,
  CHANNELS,
  IMPORTERS,
  SCHEMAS,
  CURRENT_SCHEMA,
  LANGUAGE_MODULE_STATUS,
} from './types';

export function getCmsState(state) {
  return state[ext()].cmsPage;
}

export function getCategories(state, tag = 'all') {
  const cmsState = getCmsState(state);
  const categories = _.get(cmsState, ['categories', tag]);
  return denormalizeCollection(categories, undefined, CATEGORIES);
}

export function getChildCategories(state) {
  return getCategories(state, 'child');
}

export function getCategory(categoryId) {
  return denormalizeItem(categoryId, undefined, CATEGORIES);
}

export function getLanguageModuleStatus(state) {
  const cmsState = getCmsState(state);
  const rawLanguageModule = _.get(cmsState, 'rawLanguageModule');
  const enabled = _.get(rawLanguageModule, 'data.enabled');

  const languageModule = denormalizeItem(
    cmsState.languageModule,
    undefined,
    LANGUAGE_MODULE_STATUS,
  );
  if (isInitialized(languageModule)) {
    _.set(languageModule, 'enabled', enabled);
  }

  return languageModule;
}

export function getImporters(state) {
  const cmsState = getCmsState(state);
  const importers = _.get(cmsState, 'importers');
  const collection = denormalizeCollection(importers, undefined, IMPORTERS);

  const rawImporters = _.get(cmsState, 'rawImporters.data');
  const filteredImporters = _.filter(rawImporters, rawImporter => {
    const id = _.get(rawImporter, 'id');

    if (_.find(collection, { id })) {
      return rawImporter;
    }
  });

  setStatus(filteredImporters, getStatus(collection));

  return filteredImporters;
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

export function getResources(state, categoryId) {
  const cmsState = getCmsState(state);
  const currentResources = _.get(cmsState.resources, categoryId);

  return denormalizeCollection(currentResources, undefined, CURRENT_SCHEMA);
}

export const dataInitialized = () =>
  createSelector(
    getCategories,
    getChildCategories,
    getSchema,
    (categories, childCategories, schema) => {
      return (
        isInitialized(categories) &&
        isInitialized(childCategories) &&
        isInitialized(schema)
      );
    },
  );
