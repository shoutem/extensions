import { ext } from 'context';
import _ from 'lodash';
import { combineReducers } from 'redux';
import { reducer as cmsReducer } from '@shoutem/cms-dashboard';
import { mapReducers } from '@shoutem/redux-composers';
import { collection, one, resource, storage } from '@shoutem/redux-io';
import {
  AUDIOS,
  CATEGORIES,
  CHANNELS,
  CURRENT_SCHEMA,
  IMAGES,
  IMPORTERS,
  LANGUAGE_MODULE_STATUS,
  MODULES,
  SCHEMAS,
  VIDEOS,
} from './types';

function resourceCategoriesSelector(action) {
  return _.get(action, ['meta', 'params', 'filter[categories]']);
}

const storageMappings = {
  [IMAGES]: storage(IMAGES),
  [VIDEOS]: storage(VIDEOS),
  [AUDIOS]: storage(AUDIOS),
  [CATEGORIES]: storage(CATEGORIES),
  [CHANNELS]: storage(CHANNELS),
  [MODULES]: storage(MODULES),
  [SCHEMAS]: storage(SCHEMAS),
  [LANGUAGE_MODULE_STATUS]: storage(LANGUAGE_MODULE_STATUS),
  [CURRENT_SCHEMA]: storage(CURRENT_SCHEMA),
  'shoutem.loyalty.places': storage('shoutem.loyalty.places'),
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
  modules: collection(MODULES, ext('all-modules')),
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
