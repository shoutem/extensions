import { combineReducers } from 'redux';
import {
  find,
  create,
  update,
  remove,
  getCollection,
  storage,
  collection,
} from '@shoutem/redux-io';
import { loyaltyApi } from '../../services';
import ext from '../../const';

// CONST
export const moduleName = 'cashiers';
export const CASHIERS = 'shoutem.loyalty.cashiers';

// SELECTORS
export function getCashiersState(state) {
  return state[ext()][moduleName];
}

export function getCashiers(state) {
  const cashiers = getCashiersState(state).all;
  return getCollection(cashiers, state);
}

// ACTIONS
export function loadCashiers(programId) {
  const config = {
    schema: CASHIERS,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/cashiers`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'all');
}

export function createCashier(cashier, programId, appId) {
  const config = {
    schema: CASHIERS,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/cashiers`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newCashier = {
    type: CASHIERS,
    attributes: {
      app: appId,
      ...cashier,
    },
  };

  return create(config, newCashier);
}

export function updateCashier(cashierId, cashierPatch, programId) {
  const config = {
    schema: CASHIERS,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/cashiers/${cashierId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const cashier = {
    type: CASHIERS,
    id: cashierId,
    attributes: cashierPatch,
  };

  return update(config, cashier);
}

export function deleteCashier(cashierId, programId) {
  const config = {
    schema: CASHIERS,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/cashiers/${cashierId}`),
      headers: {},
    },
  };

  return remove(config, {
    type: CASHIERS,
    id: cashierId,
  });
}

// REDUCER
export const reducer = combineReducers({
  storage: storage(CASHIERS),
  all: collection(CASHIERS, 'all'),
});
