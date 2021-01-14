import { combineReducers } from 'redux';
import { storage, one, collection, resource } from '@shoutem/redux-io';
import { mapReducers } from '@shoutem/redux-composers';
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
  IMPORTERS,
} from './types';

function resourceCategoriesSelector(action) {
  return _.get(action, ['meta', 'params', 'filter[categories]']);
}

// TODO images, videos, loyalty places need to be loaded dynamically
const storageMappings = {
  [IMAGES]: storage(IMAGES),
  [VIDEOS]: storage(VIDEOS),
  [CATEGORIES]: storage(CATEGORIES),
  [CHANNELS]: storage(CHANNELS),
  [SCHEMAS]: storage(SCHEMAS),
  [LANGUAGE_MODULE_STATUS]: storage(LANGUAGE_MODULE_STATUS),
  [CURRENT_SCHEMA]: storage(CURRENT_SCHEMA),
  ['shoutem.loyalty.places']: storage('shoutem.loyalty.places'),
};

const storageReducer = combineReducers(storageMappings);

const cmsPage = combineReducers({
  cms: cmsReducer,
  categories: combineReducers({
    all: collection(CATEGORIES, ext('all')),
    child: collection(CATEGORIES, ext('child')),
    parent: collection(CATEGORIES, ext('parent')),
    advancedChild: collection(CATEGORIES, ext('advancedChild')),
    advancedParent: collection(CATEGORIES, ext('advancedParent')),
  }),
  rawChannels: resource(CHANNELS),
  rawLanguageModule: resource(LANGUAGE_MODULE_STATUS),
  languageModule: one(LANGUAGE_MODULE_STATUS, ext('language-module')),
  languages: collection(CHANNELS, ext('all-languages')),
  importers: collection(IMPORTERS, ext('all-importers')),
  rawImporters: resource(IMPORTERS),
  schema: one(SCHEMAS, ext('schema')),
  resources: mapReducers(resourceCategoriesSelector, () =>
    collection(CURRENT_SCHEMA, ext('all')),
  ),
});

export default combineReducers({
  storage: storageReducer,
  cmsPage,
});
