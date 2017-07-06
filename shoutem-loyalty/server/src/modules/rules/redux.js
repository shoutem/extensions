import _ from 'lodash';
import { combineReducers } from 'redux';
import {
  cloneStatus,
  find,
  create,
  update,
  getCollection,
  storage,
  collection,
} from '@shoutem/redux-io';
import { createSelector } from 'reselect';
import { loyaltyApi } from '../../services';
import ext from '../../const';

// CONST
export const moduleName = 'rules';
export const RULES = 'shoutem.loyalty.rules';

// SELECTORS
export function getRulesState(state) {
  return state[ext()][moduleName];
}

export function getRules(state) {
  const rules = getRulesState(state).all;
  return getCollection(rules, state);
}

export const getRulesById = createSelector(
  getRules,
  rules => {
    const keyedById = _.keyBy(rules, 'id');
    cloneStatus(rules, keyedById);
    return keyedById;
  }
);

// ACTIONS
export function loadRules(programId) {
  const config = {
    schema: RULES,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/rules`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'all');
}

export function createRule(rule, programId) {
  const config = {
    schema: RULES,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/rules`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newRule = {
    type: RULES,
    attributes: rule,
  };

  return create(config, newRule);
}

export function updateRule(ruleId, rulePatch, programId) {
  const config = {
    schema: RULES,
    request: {
      endpoint: loyaltyApi(`/v1/programs/${programId}/rules/${ruleId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const rule = {
    type: RULES,
    id: ruleId,
    attributes: rulePatch,
  };

  return update(config, rule);
}

export function updateRules(changedRules, programId) {
  return dispatch => {
    const actions = _.map(changedRules, rulePatch => {
      const { id } = rulePatch;
      return updateRule(id, rulePatch, programId);
    });

    return Promise.all(_.map(actions, action => dispatch(action)));
  };
}

// REDUCER
export const reducer = combineReducers({
  storage: storage(RULES),
  all: collection(RULES, 'all'),
});
