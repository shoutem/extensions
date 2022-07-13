import { combineReducers } from 'redux';
import ext from 'src/const';
import { collection, resource, storage } from '@shoutem/redux-io';
import { GROUPS } from '../const';

export const reducer = combineReducers({
  [GROUPS]: storage(GROUPS),
  groups: collection(GROUPS, ext('groupsPage')),
  rawGroups: resource(GROUPS),
});
