import _ from 'lodash';
import { StateUtils } from 'react-native-navigation-experimental-compat';
import { preventStateRehydration } from 'shoutem.redux';
import {
  CLEAR_SCREEN_STATE,
  SET_ACTIVE_NAVIGATION_STACK,
  SET_SCREEN_STATE,
  NAVIGATE,
  NAVIGATE_BACK,
  NAVIGATION_INITIALIZED,
  JUMP_TO_INDEX,
  JUMP_TO_KEY,
  REPLACE,
  REPLACE_AT_INDEX,
  REPLACE_AT_KEY,
  RESET,
  RESET_TO_ROUTE,
  emptyState,
  isEmptyNavigationState,
  isNavigationAction,
} from './actions';

export const createActiveNavigationStackReducer = (initialState) =>
  (state = { ...initialState }, action) => {
    if (action.type !== SET_ACTIVE_NAVIGATION_STACK) {
      return state;
    }

    if (!action.name) {
      throw new Error('Trying to set an invalid navigator as ' +
        `the active navigator: ${JSON.stringify(action)}`);
    }

    return {
      name: action.name,
      statePath: action.statePath,
    };
  };

const initialNavigationActionReducer = (state, action) => {
  if (_.includes([NAVIGATE, RESET, RESET_TO_ROUTE], action.type)) {
    return {
      index: 0,
      routes: [action.route],
    };
  }

  throw new Error(
    `Invalid initial navigation action type. Expected '${NAVIGATE}' ` +
    `or '${RESET}' or '${RESET_TO_ROUTE}', but got '${action.type}'.`
  );
};

export const navigationCoreReducer = preventStateRehydration(
  (state = emptyState, action) => {
    if (!isNavigationAction(action)) {
      // This is not a navigation action
      return state;
    }

    if (isEmptyNavigationState(state)) {
      // We cannot use the StateUtils from RN until we have
      // a valid navigation state with at least one action.
      // There is no active screen in our apps until the
      // configuration is loaded from the server, so we use
      // the `initialNavigationActionReducer` to manually
      // calculate the initial navigation state.
      return initialNavigationActionReducer(state, action);
    }

    switch (action.type) {
      case NAVIGATE:
        return StateUtils.push(state, action.route);

      case NAVIGATE_BACK:
        if (state.index === 0 || state.routes.length === 1) return state;
        return StateUtils.pop(state);

      case JUMP_TO_INDEX:
        return StateUtils.jumpToIndex(state, action.index);

      case JUMP_TO_KEY:
        return StateUtils.jumpTo(state, action.key);

      case REPLACE:
        return StateUtils.replaceAtIndex(state, state.index, action.route);

      case REPLACE_AT_INDEX:
        return StateUtils.replaceAtIndex(state, action.index, action.route);

      case REPLACE_AT_KEY:
        return StateUtils.replaceAt(state, action.key, action.route);

      case RESET_TO_ROUTE:
        return StateUtils.reset(state, [action.route]);

      case RESET:
        return StateUtils.reset(state, action.routes, action.index || 0);

      default:
        return state;
    }
  }
);

export const createNavigationReducer = (navigationStackName) => (state, action) => {
  if (_.get(action, 'navigationStack.name') !== navigationStackName) {
    // This action should not be processed by the wrapped
    // navigation reducer, just return the current state
    // from the navigation reducer
    return navigationCoreReducer(state, {});
  }

  // The navigator name matches, the action is intended for the
  // wrapped navigation reducer, process the action normally
  return navigationCoreReducer(state, action);
};

function assertValidAction(action) {
  if (typeof action.screenId === 'undefined') {
    throw new Error(`Invalid action of type '${action.type}': invalid screenId.`);
  }
}

export function screenStateReducer(state = {}, action) {
  switch (action.type) {
    case SET_SCREEN_STATE:
      assertValidAction(action);
      return {
        ...state,
        [action.screenId]: action.screenState,
      };
    case CLEAR_SCREEN_STATE:
      assertValidAction(action);
      return {
        ...state,
        [action.screenId]: undefined,
      };
    default:
      return state;
  }
}

export const navigationInitializedReducer = (state = false, action) => {
  if (action.type === NAVIGATION_INITIALIZED) {
    return true;
  }

  return state;
}
