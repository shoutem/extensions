import {
  OPEN_MODAL,
  JUMP_TO_INITIAL_TAB,
} from './actionTypes';

import {
  navigateTo,
  jumpToKey,
  ROOT_NAVIGATION_STACK,
  getActiveNavigationStack,
  setActiveNavigationStack,
} from '@shoutem/core/navigation';

import {
  getTabNavigationStack,
  TAB_BAR_NAVIGATION_STACK,
} from '../redux';

import _ from 'lodash';

const MODAL_SCREEN = 'shoutem.navigation.Modal';
const INITIAL_TAB_SHORTCUT_PATH = ['shoutem.navigation', 'tabBar', 'navigationState', 'routes', 0, 'props', 'shortcut'];

/**
 * Opens a modal by pushing the Modal screen to the ROOT_NAVIGATION_STACK.
 * When modal is ready to display content, an arbitrary action specified in payload
 * is dispatched.
 * @param store
 */
const openModal = store => next => action => {
  if (action.type === OPEN_MODAL) {
    const { payload } = action;
    store.dispatch(navigateTo({
      screen: MODAL_SCREEN,
      props: {
        onModalActive: () => {
          store.dispatch(payload);
        },
        previousStack: getActiveNavigationStack(store.getState()),
      },
    }, undefined, ROOT_NAVIGATION_STACK));
  }

  return next(action);
};

/**
 * Jumps to the initial tab contained within the TabBar and sets the appropriate
 * NavigationStack for the same. Since the initial route is always present, we always want
 * to use thejumpToKey method.
 * @param store
 */
const jumpToInitialTab = store => next => action => {
  if (action.type === JUMP_TO_INITIAL_TAB) {
    const state = store.getState();
    const initialTabShortcut = _.get(state, INITIAL_TAB_SHORTCUT_PATH);
    const initialTabNavigationStack = getTabNavigationStack(initialTabShortcut.id);
    const stackName = initialTabNavigationStack.name;
    store.dispatch(setActiveNavigationStack(initialTabNavigationStack));
    store.dispatch(jumpToKey(stackName, TAB_BAR_NAVIGATION_STACK));
  }

  return next(action);
};

export default [openModal, jumpToInitialTab];
