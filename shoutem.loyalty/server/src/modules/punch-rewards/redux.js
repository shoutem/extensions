import { combineReducers } from 'redux';
import ext from 'src/const';
import { getLoyaltyUrl } from 'src/services';
import { collection, find, getCollection, storage } from '@shoutem/redux-io';

// CONST
export const moduleName = 'punchRewards';
export const PUNCH_CARDS = ext('punch-cards');
export const PUNCH_REWARDS = ext('punch-rewards');

// SELECTORS
export function getPunchRewardsState(state) {
  return state[ext()][moduleName];
}

export function getPunchRewards(state) {
  const { punchRewards } = getPunchRewardsState(state);
  return getCollection(punchRewards, state);
}

// ACTIONS
export function loadPunchRewards(programId, appId, scope) {
  const params = {
    q: {
      'filter[app]': appId,
      'filter[schema]': PUNCH_CARDS,
    },
    ...scope,
  };

  const config = {
    schema: PUNCH_REWARDS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/rewards/punch{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, PUNCH_REWARDS, params);
}

export const reducer = combineReducers({
  punchRewards: collection(PUNCH_REWARDS, PUNCH_REWARDS),
  storage: storage(PUNCH_REWARDS),
});
