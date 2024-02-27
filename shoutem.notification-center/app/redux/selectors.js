import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  getAllShortcuts,
  getConfiguration,
  getExtensionSettings,
} from 'shoutem.application';
import { ext } from '../const';
import { generateShortcutTree, notificationJourneys } from '../services';

function getRootShortcutId(state) {
  const configuration = getConfiguration(state);
  return configuration.navigation[0].id;
}

export function getNotificationSettings(state) {
  return state[ext()].notificationSettings;
}

export function getJourneys(state) {
  return state[ext()].notificationJourneys;
}

export function getActiveJourneys(state) {
  const journeys = getJourneys(state);

  return _.filter(journeys, notificationJourneys.isJourneyActive);
}

export function getReminderAppSettings(state) {
  const extensionSettings = getExtensionSettings(state, ext());
  return extensionSettings?.reminder || {};
}

export function getDailyMessagesAppSettings(state) {
  const extensionSettings = getExtensionSettings(state, ext());
  return extensionSettings?.scheduledNotificationsEnabled || false;
}

export function getScheduledNotifications(state) {
  return state[ext()].scheduledNotifications;
}

export function getNotificationGroups(state) {
  return state[ext()].groups.data;
}

export const getShortcutTree = createSelector(
  [getAllShortcuts, getRootShortcutId],
  (shortcuts, rootShortctutId) =>
    generateShortcutTree([_.find(shortcuts, { id: rootShortctutId })], []),
);

export const getShortcutTitle = createSelector(
  [getAllShortcuts, (_state, shortcutId) => shortcutId],
  (shortcuts, shortcutId) =>
    _.get(_.find(shortcuts, { id: shortcutId }), 'title', ''),
);
