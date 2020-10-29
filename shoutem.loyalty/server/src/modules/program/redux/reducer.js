import { combineReducers } from 'redux';
import { storage, collection } from '@shoutem/redux-io';
import ext from 'src/const';
import { PLACES, AUTHORIZATIONS, CARDS, USERS } from '../const';

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
