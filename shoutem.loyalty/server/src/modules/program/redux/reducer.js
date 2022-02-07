import { combineReducers } from 'redux';
import ext from 'src/const';
import { collection, storage } from '@shoutem/redux-io';
import { AUTHORIZATIONS, CARDS, PLACES, USERS } from '../const';

// REDUCER
export const reducer = combineReducers({
  places: collection(PLACES, ext('places')),
  cards: collection(CARDS, ext('cards')),
  authorizations: collection(AUTHORIZATIONS, ext('authorizations')),
  users: collection(USERS, ext('users')),
  storage: combineReducers({
    [CARDS]: storage(CARDS),
    [USERS]: storage(USERS),
    [PLACES]: storage(PLACES),
    [AUTHORIZATIONS]: storage(AUTHORIZATIONS),
  }),
});
