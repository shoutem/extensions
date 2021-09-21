import { AppState, Platform } from 'react-native';
import _ from 'lodash';
import { getExtensionSettings } from 'shoutem.application/redux';
import { getAppId, getSubscriptionValidState } from 'shoutem.application';
import { getUser, isAuthenticated } from 'shoutem.auth';
import { getCurrentRoute, openInModal } from 'shoutem.navigation';
import { NotificationHandlers, Firebase } from 'shoutem.firebase';
import { SendBird } from './services';
import { ext, CONNECTION_STATUSES } from './const';
import { actions, handlers, selectors } from './redux';

export function handleNotificationOpened(notification, dispatch, store) {
  const sendBirdData = _.get(notification, 'data.sendbird');

  if (!sendBirdData) {
    return;
  }

  const parsedSendBirdData =
    Platform.OS === 'ios' ? sendBirdData : JSON.parse(sendBirdData);

  const channelId = _.get(parsedSendBirdData, 'channel.channel_url');

  const state = store.getState();
  const currentRoute = getCurrentRoute();
  const activeChannelId = selectors.getActiveChannelId(state);

  const sameDestinationChannel = channelId === activeChannelId;
  const routeReady = currentRoute.name === ext('ChatWindowScreen');
  const alreadyOnScreen = sameDestinationChannel && routeReady;

  if (channelId && !alreadyOnScreen) {
    openInModal(ext('ChatWindowScreen'), { channelId });
  }
}

export function handleNotificationReceivedBackground(notification) {
  if (Platform.OS !== 'ios') {
    const sendbirdData = _.get(notification, 'data.sendbird');
    const message = _.get(notification, 'data.message');
    if (!sendbirdData) {
      return;
    }

    Firebase.presentLocalNotification({
      channelId: 'SENDBIRD',
      message,
      data: notification.data,
      somethingElse: sendbirdData,
    });
  }
}

export function handleNotification(notification, dispatch, store) {
  const { userInteraction, foreground } = notification;
  if (Platform.OS === 'ios' && userInteraction && !foreground) {
    handleNotificationOpened(notification, dispatch, store);
  }
}

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    SendBird.setForegroundState();
    return;
  }

  if (nextState === 'background' || nextState === 'inactive') {
    SendBird.setBackgroundState();
  }
}

export function appWillMount(app) {
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

  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: (notification, dispatch) =>
        handleNotificationOpened(notification, dispatch, store),
      onNotification: (notification, dispatch) =>
        handleNotification(notification, dispatch, store),
    },
  });
}

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
