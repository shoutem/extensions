import { ext } from 'context';
import { denormalizeCollection, denormalizeItem } from 'denormalizer';
import { CATEGORIES, SCHEMAS, CURRENT_SCHEMA } from './types';
import { isInitialized } from '@shoutem/redux-io';

export const getCmsState = state => state[ext()].cmsPage;

export const getCategories = state => {
  const cmsState = getCmsState(state);
  return denormalizeCollection(cmsState.categories, undefined, CATEGORIES);
};

export const getSchema = state => {
  const cmsState = getCmsState(state);
  return denormalizeItem(cmsState.schema, undefined, SCHEMAS);
};

export const getResources = state => {
  const cmsState = getCmsState(state);
  return denormalizeCollection(cmsState.resources, undefined, CURRENT_SCHEMA);
};

export const dataInitialized = (state, shortcut) => {
  const cmsState = getCmsState(state);
  const shortcutSettings = shortcut.settings || {};
  const { parentCategory } = shortcutSettings;

  const resourcesInitialized = !parentCategory || isInitialized(cmsState.resources);
  return resourcesInitialized &&
    isInitialized(cmsState.categories) &&
    isInitialized(cmsState.schema);
};
