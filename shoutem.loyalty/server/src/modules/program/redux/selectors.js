import _ from 'lodash';
import { createSelector } from 'reselect';
import { getCollection, cloneStatus } from '@shoutem/redux-io';
import ext from 'src/const';
import { moduleName } from '../const';

// SELECTORS
export function getProgramState(state) {
  return state[ext()][moduleName];
}

export function getLoyaltyPlaces(state) {
  const loyaltyPlaces = getProgramState(state).places;
  return getCollection(loyaltyPlaces, state);
}

export function getAuthorizations(state) {
  const authorizations = getProgramState(state).authorizations;
  return getCollection(authorizations, state);
}

export function makeGetAuthorizationByType(authorizationType) {
  return createSelector(
    state => getAuthorizations(state),
    authorizations => {
      const authorization = _.find(authorizations, { authorizationType }) || {};

      cloneStatus(authorizations, authorization);
      return authorization;
    }
  );
}

export function getAuthorizationByType(state, authorizationType) {
  return makeGetAuthorizationByType(authorizationType)(state);
}

export function getCards(state) {
  const cards = getProgramState(state).cards;
  return getCollection(cards, state);
}

export function getUsers(state) {
  const cards = getProgramState(state).users;
  return getCollection(cards, state);
}

export const getCardsByUserId = createSelector(
  state => getCards(state),
  cards => {
    const cardsById = _.keyBy(cards, 'user.id');
    cloneStatus(cards, cardsById);
    return cardsById;
  }
);
