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
  ROOT_NAVIGATION_STACK,
  createNavigationReducer,
  createActiveNavigationStackReducer,
  screenStateReducer,
  setActiveNavigationStackMiddleware,
} from './core';

const reducer = combineReducers({
  tabBar,
  drawer,
  modal,
  rootStack: createNavigationReducer(ROOT_NAVIGATION_STACK.name),
  activeNavigationStack: createActiveNavigationStackReducer(ROOT_NAVIGATION_STACK),
  screenState: screenStateReducer,
});

export default preventStateRehydration(reducer);

export {
  TAB_BAR_NAVIGATION_STACK,
  MODAL_NAVIGATION_STACK,
  SAVE_PREVIOUS_STACK,

  getTabNavigationStack,
  getTabNavigationStateFromTabBarState,
  getTabNavigationState,

  jumpToInitialTabBarTab,
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
