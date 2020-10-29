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
    },
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
  const users = getProgramState(state).users;
  return getCollection(users, state);
}

export const getCardsByUserId = createSelector(
  state => getCards(state),
  cards => {
    const cardsWithUser = _.filter(cards, card => _.has(card, 'user'));
    const cardsByUserId = _.keyBy(cardsWithUser, 'user.id');
    cloneStatus(cards, cardsByUserId);
    return cardsByUserId;
  },
);
