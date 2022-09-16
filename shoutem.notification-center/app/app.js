import { Platform } from 'react-native';
import _ from 'lodash';
import rio from '@shoutem/redux-io';
import {
  getAppId,
  getExtensionServiceUrl,
  getExtensionSettings,
} from 'shoutem.application';
import { Firebase } from 'shoutem.firebase';
import { before, priorities, setPriority } from 'shoutem-core';
import {
  ext,
  JOURNEY_NOTIFICATIONS_CHANNEL_ID,
  REMINDER_CHANNEL_ID,
  SCHEDULED_NOTIFICATIONS_CHANNEL_ID,
} from './const';
import getEndpointProvider, { initialize } from './EndpointProvider';
import { registerNotificationHandlers } from './notificationHandlers';
import {
  fetchGroups,
  getNotificationSettings,
  GROUPS_SCHEMA,
  NOTIFICATIONS_SCHEMA,
  SELECTED_GROUPS_SCHEMA,
  setNotificationSettings,
} from './redux';
import { notifications } from './services';

const apiRequestOptions = {
  resourceType: 'JSON',
  headers: {
    'Content-Type': 'application/json',
  },
};

export const appWillMount = setPriority(app => {
  const store = app.getStore();

  registerNotificationHandlers(store);
}, before(priorities.FIREBASE));

export const appDidMount = setPriority(async (app) => {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  const legacyApiEndpoint = getExtensionServiceUrl(state, ext(), 'cms');
  const extensionSettings = getExtensionSettings(state, ext());
  const appNotificationSettings = getNotificationSettings(state);

  // Moving from single (string) to multiple (array)
  if (_.isString(appNotificationSettings.reminderAt)) {
    const newSettings = {
      ...appNotificationSettings,
      reminderTimes: [appNotificationSettings.reminderAt],
      reminderAt: undefined,
    };

    await store.dispatch(setNotificationSettings(newSettings));
  }

  if (!legacyApiEndpoint) {
    throw new Error('Core service endpoints not found.');
  }

  initialize(legacyApiEndpoint, appId);

  const chimeSoundName = extensionSettings.chime?.fileName;
  notifications.setChimeSoundName(chimeSoundName);

  if (Platform.OS === 'android') {
    const dailyNotificationsChannelConfig = {
      channelId: SCHEDULED_NOTIFICATIONS_CHANNEL_ID, // (required, Android only)
      channelName: `${getAppId()}_daily_notifications`, // (required, Android only)
      channelDescription: 'A channel for user scheduled notifications', // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: chimeSoundName || 'default', // (optional) See `soundName` parameter of `localNotification` function
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    };

    const journeyLocalNotificationsConfig = {
      channelId: JOURNEY_NOTIFICATIONS_CHANNEL_ID, // (required, Android only)
      channelName: `${getAppId()}_journey_notifications`, // (required, Android only)
      channelDescription: 'A channel local journey notifications', // (optional) default: undefined.
      playSound: true, // (optional) default: true
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    };

   await Firebase.createNotificationChannels([
      dailyNotificationsChannelConfig,
      journeyLocalNotificationsConfig,
    ]);
  }

  // If reminder app feature is enabled via extension settings (builder)
  if (extensionSettings.reminder?.enabled) {
    const { reminder } = extensionSettings;

    if (Platform.OS === 'android') {
      const remindersChannelConfig = {
        channelId: REMINDER_CHANNEL_ID, // (required, Android only)
        channelName: `${getAppId()}_reminders`, // (required, Android only)
        channelDescription: 'A channel for daily reminder notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: chimeSoundName || 'default', // (optional) See `soundName` parameter of `localNotification` function
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      };

      Firebase.createNotificationChannels([remindersChannelConfig]).then(
        async () => {
          // After app owner enables reminder and republishes the app, reminder will be
          // automatically scheduled after user runs the app for the first time after update
          // We do this, because user's reminder setting is enabled by default, if app owner
          // enabled that feature
          if (reminder.message && appNotificationSettings.remindMeToUseApp) {
            notifications.rescheduleReminderNotifications(
              appNotificationSettings,
              reminder,
            );
          }
        },
      );
    }

    if (Platform.OS === 'ios') {
      // After app owner enables reminder and republishes the app, reminder will be
      // automatically scheduled after user runs the app for the first time after update
      // We do this, because user's reminder setting is enabled by default, if app owner
      // enabled that feature
      if (reminder.message && appNotificationSettings.remindMeToUseApp) {
        notifications.rescheduleReminderNotifications(
          appNotificationSettings,
          reminder,
        );
      }
    }
  } else {
    // After app owner disables reminder feature & republishes the app, we have
    // to cancel reminder scheduled notifications as app user doesn't see user's r
    // eminder settings any more
    await notifications.cancelReminderNotifications();
  }

  rio.registerResource({
    schema: NOTIFICATIONS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().inbox,
      ...apiRequestOptions,
    },
  });

  rio.registerResource({
    schema: GROUPS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().groups,
      ...apiRequestOptions,
    },
  });

  rio.registerResource({
    schema: SELECTED_GROUPS_SCHEMA,
    request: {
      endpoint: getEndpointProvider().selectedGroups,
      ...apiRequestOptions,
    },
  });

  const { dispatch } = store;

  dispatch(fetchGroups());
}, priorities.FIRST);
