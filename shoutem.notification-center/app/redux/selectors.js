import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application';
import { ext } from '../const';
import { notificationJourneys } from '../services';

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
