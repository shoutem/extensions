import { combineReducers } from 'redux';
import { storage, one, collection, resource } from '@shoutem/redux-io';
import { reducer as cmsReducer } from '@shoutem/cms-dashboard';
import { ext } from 'context';
import {
  CATEGORIES,
  SCHEMAS,
  IMAGES,
  VIDEOS,
  CURRENT_SCHEMA,
  CHANNELS,
  LANGUAGE_MODULE_STATUS,
} from './types';

const storageReducer = combineReducers({
  [IMAGES]: storage(IMAGES),
  [VIDEOS]: storage(VIDEOS),
  [CATEGORIES]: storage(CATEGORIES),
  [CHANNELS]: storage(CHANNELS),
  [SCHEMAS]: storage(SCHEMAS),
  [LANGUAGE_MODULE_STATUS]: storage(LANGUAGE_MODULE_STATUS),
  [CURRENT_SCHEMA]: storage(CURRENT_SCHEMA),
});

const cmsPage = combineReducers({
  cms: cmsReducer,
  categories: combineReducers({
    all: collection(CATEGORIES, ext('all')),
    child: collection(CATEGORIES, ext('child')),
    parent: collection(CATEGORIES, ext('parent')),
  }),
  rawChannels: resource(CHANNELS),
  rawLanguageModule: resource(LANGUAGE_MODULE_STATUS),
  languageModule: one(LANGUAGE_MODULE_STATUS, ext('language-module')),
  languages: collection(CHANNELS, ext('all-languages')),
  schema: one(SCHEMAS, ext('schema')),
  resources: collection(CURRENT_SCHEMA, ext('all')),
});

export default combineReducers({
  storage: storageReducer,
  cmsPage,
});
