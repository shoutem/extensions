import { combineReducers } from 'redux';
import ext from 'src/const';
import { collection, storage } from '@shoutem/redux-io';
import { USERS } from '../const';

export const reducer = combineReducers({
  storage: storage(USERS),
  currentUsersPage: collection(USERS, ext('currentUsersPage')),
});
