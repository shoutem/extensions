import { storage, collection, resource } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import ext from 'src/const';
import { GROUPS } from '../const';

export const reducer = combineReducers({
  [GROUPS]: storage(GROUPS),
  groups: collection(GROUPS, ext('groupsPage')),
  rawGroups: resource(GROUPS),
});
