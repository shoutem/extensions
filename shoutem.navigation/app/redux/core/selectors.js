import _ from 'lodash';
import { ext } from '../../const';

export const getRootNavigationStack = state => state[ext()].rootStack;

/**
 * Returns the info about the currently active navigation stack.
 *
 * @param state The global redux state.
 */
export const getActiveNavigationStack = state =>
  state[ext()].activeNavigationStack;

/**
 * Returns the currently active navigation stack state.
 *
 * @param state The global redux state.
 */
export const getActiveNavigationStackState = state => {
  const stackInfo = getActiveNavigationStack(state);
  if (!stackInfo || !stackInfo.statePath) {
    console.warn(`Unable to get the active navigation stack, stack info: ${stackInfo}`);
    return undefined;
  }

  return _.get(state, stackInfo.statePath);
};

/**
 * Returns the currently active navigation route. This is the
 * active route of the currently active navigation stack.
 *
 * @param state The global redux state.
 * @return {*} The active route.
 */
export const getActiveRoute = state => {
  const activeStackState = getActiveNavigationStackState(state);
  if (!activeStackState) {
    return undefined;
  }

  return activeStackState.routes[activeStackState.index];
};

/**
 * A selector that returns the screen state of the given screen ID
 * from the redux store.
 *
 * @param state The global redux state.
 * @param screenId The unique screen ID to get the state for.
 * @returns {{}} The screen state.
 */
export const getScreenState = (state, screenId) => {
  return state[ext()].screenState[screenId] || {}
};

export const getNavigationInitialized = state =>
  state[ext()].navigationInitialized;
