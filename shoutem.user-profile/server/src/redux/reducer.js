import { combineReducers } from 'redux';
import { collection, storage } from '@shoutem/redux-io';
import { ext } from '../const';
import { USER_GROUPS, USERS } from './actions';

export const reducer = combineReducers({
  users: storage(USERS),
  userGroups: storage(USER_GROUPS),
  currentUsersPage: collection(USERS, ext('currentUsersPage')),
});
