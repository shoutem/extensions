import _ from 'lodash';
import { combineReducers } from 'redux';
import { mapReducers } from '@shoutem/redux-composers';

import { createNavigationReducer, navigationReducer } from '@shoutem/core/navigation';

import { ext } from '../const';

const TAB_NAVIGATOR_PREFIX = 'tab-';
export const TAB_BAR_NAVIGATION_STACK = {
  name: ext('TabBar'),
  statePath: [ext(), 'tabBar', 'tabBarState'],
};
export const getTabNavigationStack = (tabId) => {
  const name = `${TAB_NAVIGATOR_PREFIX}${tabId}`;
  return {
    name,
    statePath: [ext(), 'tabBar', 'tabStates', name],
  };
};

// tabBarState represents the main navigation state
const tabBarState = createNavigationReducer(TAB_BAR_NAVIGATION_STACK.name);

// eslint-disable-next-line arrow-body-style
const tabKeySelector = action => {
  const stackName = _.get(action, 'navigationStack.name');
  return _.startsWith(stackName, TAB_NAVIGATOR_PREFIX) ? stackName : undefined;
};
const tabStates = mapReducers(tabKeySelector, navigationReducer);

export const getTabNavigationStateFromTabBarState = (tabBarState, tabId) =>
  tabBarState.tabStates[getTabNavigationStack(tabId).name];

export const getTabNavigationState = (state, tabId) =>
  getTabNavigationStateFromTabBarState(state[ext()].tabBar, tabId);

export default combineReducers({
  navigationState: tabBarState,
  tabStates,
});
