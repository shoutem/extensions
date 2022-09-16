import { AppState, Platform } from 'react-native';
import _ from 'lodash';
import { getAppId, getSubscriptionValidState } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import { getUser, isAuthenticated } from 'shoutem.auth';
import { Firebase, NotificationHandlers } from 'shoutem.firebase';
import { before, priorities, setPriority } from 'shoutem-core';
import { CONNECTION_STATUSES, ext } from './const';
import { registerNotificationHandlers } from './notificationHandlers';
import { actions, handlers } from './redux';
import { SendBird } from './services';

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    SendBird.setForegroundState();
    return;
  }

  if (nextState === 'background' || nextState === 'inactive') {
    SendBird.setBackgroundState();
  }
}

export const appWillMount = setPriority(app => {
  const store = app.getStore();

  if (Platform.OS === 'android') {
    const sendbirdChannelConfig = {
      channelId: 'SENDBIRD',
      channelName: 'SENDBIRD_CHANNEL',
      channelDescription: 'A channel for sendbid pushes',
    };

    Firebase.createNotificationChannels([sendbirdChannelConfig]);
  }

  if (Platform.OS !== 'ios') {
    NotificationHandlers.registerFCMTokenReceivedHandler({
      owner: ext(),
      onTokenReceived: SendBird.registerPushToken,
    });
  }

  if (Platform.OS === 'ios') {
    NotificationHandlers.registerAPNSTokenReceivedHandler({
      owner: ext(),
      onTokenReceived: SendBird.registerPushToken,
    });
  }

  registerNotificationHandlers(store);
}, before(priorities.FIREBASE));

export function appDidFinishLaunching(app) {
  const store = app.getStore();
  const state = store.getState();
  const isLoggedIn = isAuthenticated(state);
  const user = getUser(state);
  const extensionSettings = getExtensionSettings(state, ext());
  const { appId, shoutemAppId, featureActive } = extensionSettings;
  const resolvedAppId = _.isEmpty(appId) ? shoutemAppId : appId;
  const metadata = { appId: getAppId().toString() };
  const hasValidSubscription = getSubscriptionValidState(state);

  AppState.addEventListener('change', handleAppStateChange);

  const channelHandlers = {
    onMessageReceived: handlers.onMessageReceivedHandler(
      store.dispatch,
      store.getState,
    ),
    onChannelChanged: handlers.onChannelChangedHandler(
      store.dispatch,
      store.getState,
    ),
    onTypingStatusUpdated: handlers.onTypingStatusUpdatedHandler(
      store.dispatch,
    ),
  };

  const connectionHandlers = {
    onReconnectStarted: handlers.onReconnectStarted(store.dispatch),
    onReconnectSucceeded: handlers.onReconnectSucceeded(store.dispatch),
    onReconnectFailed: handlers.onReconnectFailed(store.dispatch),
  };

  if (isLoggedIn && featureActive && hasValidSubscription) {
    store.dispatch(actions.setConnectionState(CONNECTION_STATUSES.CONNECTING));
    SendBird.init({
      appId: resolvedAppId,
      user,
      channelHandlers,
      connectionHandlers,
      metadata,
    })
      .then(() => {
        store.dispatch(
          actions.setConnectionState(CONNECTION_STATUSES.CONNECTED),
        );
        SendBird.registerPushToken();
      })
      .catch(() =>
        store.dispatch(
          actions.setConnectionState(CONNECTION_STATUSES.DISCONNECTED),
        ),
      );
  }
}

export function appWillUnmount() {
  const SendBirdInstance = SendBird.getInstance();

  AppState.removeEventListener('change', handleAppStateChange);

  if (SendBirdInstance) {
    SendBird.disconnect();
  }
}
