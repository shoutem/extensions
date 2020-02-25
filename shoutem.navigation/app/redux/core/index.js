import {
  createActiveNavigationStackReducer,
  createNavigationReducer,
  navigationCoreReducer,
  screenStateReducer,
} from './reducers';

import {
  SET_ACTIVE_NAVIGATION_STACK,
  ROOT_NAVIGATION_STACK,

  // Navigation actions
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

  // Navigation action creators
  createNavigationAction,
  navigateTo,
  navigateBack,
  redirectTo,
  jumpToKey,
  jumpToIndex,
  replace,
  reset,
  resetToRoute,
  openInModal,
  closeModal,
  rewrite,

  // Screen state actions & action creators
  SET_SCREEN_STATE,
  CLEAR_SCREEN_STATE,
  clearScreenState,
  setActiveNavigationStack,
  setScreenState,

  // Helpers
  hasRouteWithKey,
  isEmptyNavigationState,
  EMPTY_ROUTE,
  isEmptyRoute,
  isNavigationAction,
  isScreenActive,
  sanitizeRoute,
} from './actions';

import {
  getActiveNavigationStack,
  getActiveNavigationStackState,
  getActiveRoute,
  getRootNavigationStack,
  getScreenState,
} from './selectors';

import {
  setActiveNavigationStackMiddleware,
} from './middlewares';

export {
  NAVIGATE,
  NAVIGATE_BACK,
  JUMP_TO_INDEX,
  JUMP_TO_KEY,
  REPLACE,
  REPLACE_AT_INDEX,
  REPLACE_AT_KEY,
  RESET,
  RESET_TO_ROUTE,
  EMPTY_ROUTE,
  OPEN_MODAL,
  CLOSE_MODAL,
  SET_SCREEN_STATE,
  CLEAR_SCREEN_STATE,
  ROOT_NAVIGATION_STACK,
  SET_ACTIVE_NAVIGATION_STACK,
  createNavigationAction,
  navigateTo,
  navigateBack,
  redirectTo,
  jumpToKey,
  jumpToIndex,
  replace,
  reset,
  resetToRoute,
  openInModal,
  closeModal,
  rewrite,
  clearScreenState,
  setActiveNavigationStack,
  setScreenState,
  hasRouteWithKey,
  isEmptyNavigationState,
  isEmptyRoute,
  isNavigationAction,
  isScreenActive,
  sanitizeRoute,

  createActiveNavigationStackReducer,
  createNavigationReducer,
  navigationCoreReducer,
  screenStateReducer,

  getActiveNavigationStack,
  getActiveNavigationStackState,
  getActiveRoute,
  getScreenState,
  setActiveNavigationStackMiddleware,
  getRootNavigationStack,
};
