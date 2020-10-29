import { combineReducers } from 'redux';
import { storage, one, collection, resource } from '@shoutem/redux-io';
import { ext } from 'context';
import { CATEGORIES, SCHEMAS, CURRENT_SCHEMA, CHANNELS } from './types';

const storageReducer = combineReducers({
  [CATEGORIES]: storage(CATEGORIES),
  [CHANNELS]: storage(CHANNELS),
  [SCHEMAS]: storage(SCHEMAS),
  [CURRENT_SCHEMA]: storage(CURRENT_SCHEMA),
});

const cmsPage = combineReducers({
  categories: combineReducers({
    all: collection(CATEGORIES, ext('all')),
    child: collection(CATEGORIES, ext('child')),
    parent: collection(CATEGORIES, ext('parent')),
  }),
  rawChannels: resource(CHANNELS),
  languages: collection(CHANNELS, ext('all-languages')),
  schema: one(SCHEMAS, ext('schema')),
  resources: collection(CURRENT_SCHEMA, ext('all')),
});

export default combineReducers({
  storage: storageReducer,
  cmsPage,
});
