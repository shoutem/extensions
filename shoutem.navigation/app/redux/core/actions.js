import _ from 'lodash';
import { StateUtils } from 'react-native-navigation-experimental-compat';

import { getActiveRoute } from './selectors';
import { ext } from '../../const';

export const SET_ACTIVE_NAVIGATION_STACK = ext('SET_ACTIVE_NAVIGATION_STACK');

export const ROOT_NAVIGATION_STACK = {
  name: ext('RootNavigationStack'),
  statePath: [ext(), 'rootStack'],
};

export const NAVIGATE = ext('NAVIGATE');
export const NAVIGATE_BACK = ext('NAVIGATE_BACK');
export const JUMP_TO_INDEX = ext('JUMP_TO_INDEX');
export const JUMP_TO_KEY = ext('JUMP_TO_KEY');
export const REPLACE = ext('REPLACE');
export const REPLACE_AT_INDEX = ext('REPLACE_AT_INDEX');
export const REPLACE_AT_KEY = ext('REPLACE_AT_KEY');
export const RESET_TO_ROUTE = ext('RESET_TO_ROUTE');
export const RESET = ext('RESET');
export const OPEN_MODAL = ext('OPEN_MODAL');
export const CLOSE_MODAL = ext('CLOSE_MODAL');

export const SET_SCREEN_STATE = ext('SET_SCREEN_STATE');
export const CLEAR_SCREEN_STATE = ext('CLEAR_SCREEN_STATE');
export const NAVIGATION_INITIALIZED = ext('NAVIGATION_INITIALIZED');

const NAVIGATION_ACTION_TYPES = [
  NAVIGATE,
  NAVIGATE_BACK,
  JUMP_TO_INDEX,
  JUMP_TO_KEY,
  REPLACE,
  REPLACE_AT_INDEX,
  REPLACE_AT_KEY,
  RESET,
  RESET_TO_ROUTE,
  OPEN_MODAL,
  CLOSE_MODAL,
];

const rewritableActionTypes = [NAVIGATE, REPLACE, RESET_TO_ROUTE];

export const EMPTY_ROUTE = Object.freeze({ key: ext('EMPTY_ROUTE') });

export const emptyState = {
  index: -1,
  routes: [],
};

/**
 * Creates a valid navigation stack route. This function
 * currently ensures that each route only has a valid key.
 *
 * @param route The original route.
 * @param navigationStack The navigation stack to use.
 */
export const sanitizeRoute = (route, navigationStack) => ({
  ...route,
  key: _.get(route, 'key', _.uniqueId(_.get(navigationStack, 'name'))),
});

/**
 * Returns true for all navigation actions.
 *
 * @param action The action to examine.
 */
export const isNavigationAction = action => _.includes(NAVIGATION_ACTION_TYPES, action.type);

/**
 * Returns `true` if the navigation state is the initial
 * state created by the reducer, i.e. it was not modified
 * by any navigation action.
 *
 * @param state The navigation state to examine.
 */
export const isEmptyNavigationState = state => !state || state === emptyState;

/**
 * Returns `true` if the route is an empty navigation route.
 * Empty routes may be used for placeholders that will not be
 * rendered by navigation stacks.
 *
 * @param route The route to test.
 */
export const isEmptyRoute = route => route && route.key === EMPTY_ROUTE.key;

/**
 * Checks if the screen with the given id is active.
 * @param state The global redux state.
 * @param screenId Id of the screen to check.
 * @returns {Boolean}
*/
export const isScreenActive = (state, screenId) => _.get(getActiveRoute(state), 'key') === screenId;

/**
 * Returns `true` if the route with a given key exists in the navigation state.
 *
 * @param navigationState The navigation state.
 * @param key The route key to test for.
 * @returns {bool} `true` if the route exists, `false` otherwise.
 */
export const hasRouteWithKey = StateUtils.has;

/**
 * Navigates to the specified route using the specified navigator.
 * @param route The route to navigate to
 * @param navigationStack The navigation stack to use, this is an optional
 * parameter, the active navigation stack will be used if it is undefined.
 * @returns {*} The action.
 */
export const navigateTo = (route, navigationStack) => {
  const key = route.key || _.uniqueId(_.get(navigationStack, 'name'));

  return {
    type: NAVIGATE,
    route: {
      ...route,
      key,
    },
    navigationStack,
  };
};

/**
 * Replaces the current route in the navigation stack with the provided route.
 *
 * @param route The new navigation route.
 * @param navigationStack The navigation stack to use.
 * @return {*} The action.
 */
export const replace = (route, navigationStack) => ({
  type: REPLACE,
  route: sanitizeRoute(route, navigationStack),
  navigationStack,
});

/**
 * The source object is the one we're merging into the original one.
 * If it has undefined property values, we ignore these properties.
 * @param objValue Original property value in the destination object
 * @param srcValue Property value in the source object
 * @returns {*} Property value from source object if not undefined, original value otherwise
 */
const skipUndefined = (objValue, srcValue) => (_.isUndefined(srcValue) ? objValue : srcValue);

/**
 * Modifies an existing navigation action
 *
 * @param action The original action.
 * @param type New action type.
 * @param route New route.
 * @param navigationStack New navigation stack to use.
 * @return {*} The new action.
 */
export const rewrite = (action, type, route, navigationStack) => {
  if (!_.includes(rewritableActionTypes, action.type)) {
    throw new Error(
      `Trying to rewrite an unsupported action, expected one of: ` +
      `'${rewritableActionTypes}', but got: '${action.type}'.`,
    );
  }

  if (type && !_.includes(rewritableActionTypes, type)) {
    throw new Error(
      `Trying to set an unsupported type, expected one of: ` +
      `'${rewritableActionTypes}', but got: '${type}'.`,
    );
  }

  const updates = {
    type,
    navigationStack,
  };

  if (route) {
    const { context } = action.route;

    updates.route = _.merge({ context }, sanitizeRoute(route, navigationStack));
  }

  return _.assignWith(_.cloneDeep(action), updates, skipUndefined);
};

/**
 * Redirects an action by changing the action's route
 * with the new route inheriting the previous route's context
 * @param action The action to be redirected
 * @param route The route to navigate to
 * @returns {*} The action.
 */
export const redirectTo = (action, route) => rewrite(action, undefined, route);

/**
 * Resets the navigation stack to the provided route.
 *
 * @param route The new navigation route.
 * @param navigationStack The navigation stack to use.
 * @return {*} The action.
 */
export const resetToRoute = (route, navigationStack) => {
  return {
    type: RESET_TO_ROUTE,
    route: sanitizeRoute(route, navigationStack),
    navigationStack,
  };
};

/**
 * Resets the navigation stack to the provided array of routes
 * with the index of currently active route
 *
 * @param routes Array of new routes.
 * @param index Active route index.
 * @param navigationStack The navigation stack to use.
 * @return {*} The action.
 */
export const reset = (routes, index, navigationStack) => {
  const sanitizedRoutes = _.map(routes, route => sanitizeRoute(route, navigationStack));

  return {
    type: RESET,
    routes: sanitizedRoutes,
    index,
    navigationStack,
  };
};

/**
 * Jumps to the route with the given key in the given navigator.
 *
 * @param key The route key to navigate to.
 * @param navigationStack The navigation stack to use, this is an optional
 * parameter, the active navigation stack will be used if it is undefined.
 * @returns {*} The action.
 */
export const jumpToKey = (key, navigationStack) => ({
  type: JUMP_TO_KEY,
  key,
  navigationStack,
});

/**
 * Jumps to the route with the given index in the given navigator.
 *
 * @param index The route index to navigate to.
 * @param navigationStack The navigation stack to use, this is an optional
 * parameter, the active navigation stack will be used if it is undefined.
 * @returns {*} The action.
 */
export const jumpToIndex = (index, navigationStack) => ({
  type: JUMP_TO_INDEX,
  index,
  navigationStack,
});

/**
 * Navigates one step back on the active navigation stack.
 * @param navigationStack The navigation stack to use, this is an optional
 * parameter, the active navigation stack will be used if it is undefined.
 * @returns {*} The action.
 */
export const navigateBack = navigationStack => ({
  type: NAVIGATE_BACK,
  navigationStack,
});

/**
 * @see OPEN_MODAL
 * Navigates to the specified route in a new modal window.
 * @returns {{ type: String, route: {} }}
 */
export const openInModal = route => ({
  type: OPEN_MODAL,
  route,
});

/**
 * @see CLOSE_MODAL
 * Closes the active modal window.
 * @returns {{ type: String }}
 */
export const closeModal = () => ({
  type: CLOSE_MODAL,
});


/**
 * Returns a navigation action for given type.
 *
 * @param actionType Action type: REPLACE, RESET, RESET_TO_ROUTE, OPEN_MODAL
 *  or NAVIGATE (the default)
 * @param route The original route.
 * @param navigationStack The navigation stack to use.
 */
export const createNavigationAction = (actionType, route, navigationStack) => {
  switch (actionType) {
    case REPLACE:
      return replace(route, navigationStack);

    case RESET_TO_ROUTE:
      return resetToRoute(route, navigationStack);

    case RESET:
      return reset([route], 0, navigationStack);

    case OPEN_MODAL:
      return openInModal(route);

    default:
      return navigateTo(route, navigationStack);
  }
};

/**
 * Sets the active navigation stack. All subsequent navigation actions
 * that don't explicitly specify the stack name will use this navigation
 * stack.
 *
 * @param {String} navigationStackInfo.name The name of the new active navigation stack.
 * @param {[String]} navigationStackInfo.statePath The path to the new navigation stack state.
 * @returns {*} The action.
 */
export const setActiveNavigationStack = navigationStackInfo => ({
  type: SET_ACTIVE_NAVIGATION_STACK,
  name: navigationStackInfo.name,
  statePath: navigationStackInfo.statePath,
});


/**
 * Sets the navigationInitialized flag as true. Needed to make sure any logic
 * that has to be executed only after initial shortcut is opened is done then.
 */
export const setNavigationInitialized = () => ({
  type: NAVIGATION_INITIALIZED,
});

/**
 * Sets the screen state for the screen with the given ID.
 *
 * @param screenId The unique ID of the screen
 * @param screenState The screen state to save in the store
 * @returns {{type: string, screenId: *, state: *}} The set screen state action
 */
export const  setScreenState = (screenId, screenState) => ({
  type: SET_SCREEN_STATE,
  screenId,
  screenState,
});

/**
 * Clears the screen state for the screen with the given ID.
 *
 * @param screenId The unique ID of the screen.
 * @returns {{type: string, screenId: *}} The clear screen state action
 */
export const clearScreenState = screenId => ({
  type: CLEAR_SCREEN_STATE,
  screenId,
});
