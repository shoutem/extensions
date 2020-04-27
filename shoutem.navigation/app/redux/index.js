import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import tabBar, {
  TAB_BAR_NAVIGATION_STACK,
  getTabNavigationStack,
  getTabNavigationStateFromTabBarState,
  getTabNavigationState,
  jumpToInitialTabBarTab,
  jumpToInitialTabMiddleware,
} from './tabBar';

import drawer from './drawer';

import modal, {
  MODAL_NAVIGATION_STACK,
  SAVE_PREVIOUS_STACK,

  openModalMiddleware,
  closeModalMiddleware,
} from './modal';

import {
  debounceNavigationMiddleware,
} from './debounceNavigation';

import {
  NAVIGATION_INITIALIZED,
  ROOT_NAVIGATION_STACK,
  createNavigationReducer,
  createActiveNavigationStackReducer,
  screenStateReducer,
  setActiveNavigationStackMiddleware,
  navigationInitializedReducer,
  getNavigationInitialized,
  setNavigationInitialized,
} from './core';

const reducer = combineReducers({
  tabBar,
  drawer,
  modal,
  rootStack: createNavigationReducer(ROOT_NAVIGATION_STACK.name),
  activeNavigationStack: createActiveNavigationStackReducer(ROOT_NAVIGATION_STACK),
  screenState: screenStateReducer,
  navigationInitialized: navigationInitializedReducer,
});

export default preventStateRehydration(reducer);

export {
  TAB_BAR_NAVIGATION_STACK,
  MODAL_NAVIGATION_STACK,
  SAVE_PREVIOUS_STACK,
  NAVIGATION_INITIALIZED,

  getTabNavigationStack,
  getTabNavigationStateFromTabBarState,
  getTabNavigationState,
  getNavigationInitialized,

  jumpToInitialTabBarTab,
  setNavigationInitialized,
};

export {
  DRAWER_NAVIGATION_STACK,
} from './drawer';

export const middleware = [
  openModalMiddleware,
  closeModalMiddleware,
  jumpToInitialTabMiddleware,
  debounceNavigationMiddleware,
  setActiveNavigationStackMiddleware,
];
