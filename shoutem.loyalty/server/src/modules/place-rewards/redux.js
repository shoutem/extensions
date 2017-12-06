import { combineReducers } from 'redux';
import _ from 'lodash';
import { getCollection, collection, storage } from '@shoutem/redux-io';
import { updateShortcutSettings } from '@shoutem/redux-api-sdk';
import ext from 'src/const';
import {
  loadResources,
  deleteResource,
  createCategory,
  navigateToCms,
  CATEGORIES,
} from 'src/modules/cms';

// CONST
export const moduleName = 'placeRewards';
export const PLACE_REWARDS = ext('place-rewards');

// SELECTORS
export function getRewardsState(state) {
  return state[moduleName];
}

export function getShortcutRewards(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const rewards = getRewardsState(shortcutState).placeRewards;
  return getCollection(rewards, state);
}

// ACTIONS
export function loadShortcutRewards(appId, categoryId, placeId, scope) {
  const filter = placeId ? { 'filter[place.id]': placeId } : null;
  return loadResources(
    appId,
    categoryId,
    PLACE_REWARDS,
    filter,
    ext('placeRewards'),
    scope
  );
}

export function deleteReward(appId, resourceId, scope) {
  return deleteResource(appId, resourceId, PLACE_REWARDS, scope);
}

export function createRewardsCategory(appId, categoryName, shortcut, scope) {
  return dispatch => (
    dispatch(createCategory(appId, PLACE_REWARDS, categoryName, scope))
      .then(categoryId => {
        const rewardsCategoryId = _.toString(categoryId);
        const settingsPatch = {
          cmsCategory: {
            id: rewardsCategoryId,
            type: CATEGORIES,
          },
        };

        return dispatch(updateShortcutSettings(shortcut, settingsPatch))
          .then(() => rewardsCategoryId);
      })
  );
}

export function openRewardsCmsEditor(appId, categoryId) {
  return navigateToCms(appId, categoryId, PLACE_REWARDS);
}

// REDUCERS
export const shortcutReducer = combineReducers({
  placeRewards: collection(PLACE_REWARDS, ext('placeRewards')),
});

export const extensionReducer = combineReducers({
  PLACE_REWARDS: storage(PLACE_REWARDS),
});
