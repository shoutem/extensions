import _ from 'lodash';
import { Platform } from 'react-native';
import rio from '@shoutem/redux-io';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { Firebase } from 'shoutem.firebase';
import {
  ext,
  REMINDER_CHANNEL_ID,
  SCHEDULED_NOTIFICATIONS_CHANNEL_ID,
} from './const';
import getEndpointProvider, { initialize } from './EndpointProvider';
import {
  fetchGroups,
  getNotificationSettings,
  GROUPS_SCHEMA,
  NOTIFICATIONS_SCHEMA,
  SELECTED_GROUPS_SCHEMA,
} from './redux';
import { registerNotificationHandlers } from './notificationHandlers';
import { notifications } from './services';

const APPLICATION_EXTENSION = 'shoutem.application';

const apiRequestOptions = {
  resourceType: 'JSON',
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  const extensionSettings = getExtensionSettings(state, ext());
  const reminderEnabled = _.get(extensionSettings, 'reminder.enabled', true);
  const reminderMessage = extensionSettings?.reminder?.message;
  const applicationExtensionSettings = getExtensionSettings(
    state,
    APPLICATION_EXTENSION,
  );
  const remindMeToUseApp = getNotificationSettings(state).remindMeToUseApp;
  const reminderAt = getNotificationSettings(state).reminderAt;
  const legacyApiEndpoint = _.get(
    applicationExtensionSettings,
    'legacyApiEndpoint',
  );

  if (!legacyApiEndpoint) {
    throw new Error(
      `Legacy api endpoint not configured. Check the ${APPLICATION_EXTENSION} extension settings.`,
    );
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

    Firebase.createNotificationChannels([dailyNotificationsChannelConfig]);
  }

  if (reminderEnabled) {
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
          if (reminderEnabled && reminderMessage && remindMeToUseApp) {
            await notifications.scheduleReminderNotifications(
              reminderMessage,
              reminderAt,
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
      if (reminderEnabled && reminderMessage && remindMeToUseApp) {
        await notifications.scheduleReminderNotifications(
          reminderMessage,
          reminderAt,
        );
      }
    }
  } else {
    // After app owner disables reminder feature & republishes the app, we have
    // to cancel reminder scheduled notifications as app user doesn't see user's r
    // eminder settings any more
    await notifications.cancelReminderNotifications();
  }

  registerNotificationHandlers(store);

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
}
