import { combineReducers } from 'redux';
import ext from 'src/const';
import { collection, storage } from '@shoutem/redux-io';
import { USER_GROUPS } from '../const';

export const reducer = combineReducers({
  [USER_GROUPS]: storage(USER_GROUPS),
  allUserGroups: collection(USER_GROUPS, ext('allUserGroups')),
  userGroups: collection(USER_GROUPS, ext('userGroups')),
});
