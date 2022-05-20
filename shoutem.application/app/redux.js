import _ from 'lodash';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import {
  find,
  getCollection,
  getOne,
  loaded,
  one,
  storage,
} from '@shoutem/redux-io';
import { preventStateRehydration } from 'shoutem.redux';
import configuration from './configuration.json';
import {
  APP_SUBSCRIPTION_SCHEMA,
  APP_SUBSCRIPTION_TAG,
  APPLICATION_SCHEMA,
  CONFIGURATION_SCHEMA,
  CONFIGURATION_TAG,
  ext,
  EXTENSIONS_SCHEMA,
  SCREENS_SCHEMA,
  SHORTCUTS_SCHEMA,
} from './const';
import { AppInitQueue } from './services';

// Because of chrome inspection bug we are exporting function as constants
// Bug is we can not set breakpoint in files which export function directly
/* eslint-disable func-names */

export const EXECUTE_SHORTCUT = 'shoutem.application.EXECUTE_SHORTCUT';
export const SET_ACTIVE_SHORTCUT = 'shoutem.application.SET_ACTIVE_SHORTCUT';
export const HIDE_SHORTCUTS = 'shoutem.application.HIDE_SHORTCUTS';
export const SHOW_SHORTCUT = 'shoutem.application.SHOW_SHORTCUT';
export const SHOW_ALL_SHORTCUTS = 'shoutem.application.SHOW_ALL_SHORTCUTS';
export const RESTART_APP = 'shoutem.application.RESTART_APP';
export const QUEUE_TARGET_COMPLETED =
  'shoutem.application.QUEUE_TARGET_COMPLETED';

export function restartApp() {
  return {
    type: RESTART_APP,
  };
}

export function fetchAppSubscriptionStatus(appId) {
  return find(APP_SUBSCRIPTION_SCHEMA, APP_SUBSCRIPTION_TAG, { appId });
}

export function fetchConfiguration(appId) {
  return find(CONFIGURATION_SCHEMA, CONFIGURATION_TAG, { appId });
}

export function loadLocalConfiguration() {
  return loaded(configuration, CONFIGURATION_SCHEMA, CONFIGURATION_TAG);
}

export function getConfiguration(state) {
  return getOne(state[ext()].configuration, state);
}

export function getSubscriptionValidState(state) {
  const subscription = getOne(state[ext()].subscription, state);

  return _.get(subscription, 'valid', false);
}

export function getShortcut(state, shortcutId) {
  return getOne(shortcutId, state, 'shoutem.core.shortcuts');
}

export function isShortcutVisible(state, shortcutId) {
  return !_.find(state[ext()].hiddenShortcuts, id => shortcutId === id);
}

export function getHiddenShortcuts(state) {
  return state[ext()].hiddenShortcuts;
}

export function hideShortcuts(shortcutIds) {
  return {
    type: HIDE_SHORTCUTS,
    shortcutIds,
  };
}

export function showShortcut(shortcutId) {
  return {
    type: SHOW_SHORTCUT,
    shortcutId,
  };
}

export function showAllShortcuts() {
  return {
    type: SHOW_ALL_SHORTCUTS,
  };
}

export function setQueueTargetComplete(targetName) {
  return {
    type: QUEUE_TARGET_COMPLETED,
    payload: targetName,
  };
}

export function getAppInitQueue(state) {
  return state[ext()].appInitQueue;
}

export function getAppInitQueueComplete(state) {
  const queue = getAppInitQueue(state);

  return _.every(queue, item => item === true);
}

export function hiddenShortcuts(state = [], action) {
  const { type, shortcutId, shortcutIds } = action;
  switch (type) {
    case HIDE_SHORTCUTS:
      return _.uniq([...state, ...shortcutIds]);
    case SHOW_SHORTCUT:
      return _.without(state, shortcutId);
    case SHOW_ALL_SHORTCUTS:
      return [];
    default:
      return state;
  }
}

export function appInitQueue(
  state = AppInitQueue.formatInitialReducerState(),
  action,
) {
  switch (action.type) {
    case QUEUE_TARGET_COMPLETED:
      return {
        ...state,
        [action.payload]: true,
      };
    default:
      return state;
  }
}

export const getExtensionState = state => {
  return state[ext()];
};

/**
 * A selector that returns extension settings of the currently running application.
 *
 * @param state The redux state
 * @param extensionName The name of the currently running application
 * @returns {*} Settings of application
 */
export const getExtensionSettings = createSelector(
  [getExtensionState, (_state, extensionName) => extensionName],
  (extension, extensionName) =>
    _.get(
      extension,
      ['extensions', extensionName, 'attributes', 'settings'],
      {},
    ),
);

export function getExtensionCloudUrl(state, extensionName) {
  return _.get(state[ext()], [
    'extensions',
    extensionName,
    'attributes',
    'settings',
    'services',
    'self',
    'cloud',
  ]);
}

export function getExtensionServiceUrl(state, extensionName, serviceName) {
  return _.get(state[ext()], [
    'extensions',
    extensionName,
    'attributes',
    'settings',
    'services',
    'core',
    serviceName,
  ]);
}

/**
 * A selector that returns shortcuts
 *
 * @param state The redux state
 * @returns {Array} Shortcuts of the application
 */
export const getAllShortcuts = _.memoize(
  state => {
    const allShortcuts = _.keys(state[ext()].shortcuts);

    return getCollection(allShortcuts, state, SHORTCUTS_SCHEMA);
  },
  state => state[ext()].configuration.value,
);

// create reducer with wanted default configuration
const reducer = combineReducers({
  configuration: one(CONFIGURATION_SCHEMA, CONFIGURATION_TAG, undefined),
  configurations: storage(CONFIGURATION_SCHEMA),
  applications: storage(APPLICATION_SCHEMA),
  screens: storage(SCREENS_SCHEMA),
  extensions: storage(EXTENSIONS_SCHEMA),
  shortcuts: storage(SHORTCUTS_SCHEMA),
  subscriptions: storage(APP_SUBSCRIPTION_SCHEMA),
  subscription: one(APP_SUBSCRIPTION_SCHEMA, APP_SUBSCRIPTION_TAG, undefined),
  hiddenShortcuts,
  appInitQueue,
});

export default preventStateRehydration(reducer);
