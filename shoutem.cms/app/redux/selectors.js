import { getCollection } from '@shoutem/redux-io';

import { ext } from '../const';

/**
 * A selector that returns all child categories of a given
 * parent category from the redux state.
 *
 * @param state The global redux state.
 * @param parentId The parent category ID.
 * @returns {[]} The child categories.
 */
export function getCategories(state, parentId) {
  return getCollection(state[ext()].childCategories[parentId], state);
}

export function getLocationPermissionStatus(state) {
  return state[ext()].permissionStatus;
}

/**
 * A selector that returns the screen state of the given screen ID
 * from the redux store.
 *
 * @param state The global redux state.
 * @param screenId The unique screen ID to get the state for.
 * @returns {{}} The screen state.
 */
export const getScreenState = (state, screenId) => {
  return state[ext()].screenState[screenId] || {};
};
