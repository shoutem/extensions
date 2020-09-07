import { AppState, Platform } from 'react-native';
import _ from 'lodash';
import { getUser, isAuthenticated } from 'shoutem.auth';
import { NotificationHandlers } from 'shoutem.firebase';
import { navigateTo, getActiveRoute, getNavigationInitialized, replace } from 'shoutem.navigation';
import { getExtensionSettings } from 'shoutem.application/redux';
import { SendBird } from './services';
import { ext, CONNECTION_STATUSES } from './const';
import { actions, handlers, selectors } from './redux';

export function handleNotificationOpened(notification, dispatch, store) {
  const sendBirdData = _.get(notification, 'data.sendbird');

  if (!sendBirdData) {
    return;
  }

  const parsedSendBirdData = Platform.OS === 'ios' ? sendBirdData : JSON.parse(sendBirdData);

  const channelId = _.get(parsedSendBirdData, 'channel.channel_url');

  const state = store.getState();
  const navigationInitialized = getNavigationInitialized(state);
  const activeRoute = getActiveRoute(state);
  const currentScreen = _.get(activeRoute, 'screen');
  const activeChannelId = selectors.getActiveChannelId(state);

  if (!navigationInitialized) {
    store.dispatch(actions.queueNotification(notification));
    return;
  }

  const sameDestinationChannel = channelId === activeChannelId;
  const routeReady = currentScreen === ext('ChatWindowScreen');
  const alreadyOnScreen = sameDestinationChannel && routeReady;
  const navigationAction = routeReady && !sameDestinationChannel ? replace : navigateTo;

  if (channelId && !alreadyOnScreen) {
    dispatch(navigationAction({
      screen: ext('ChatWindowScreen'),
      props: { channelId },
    }));
  }
}

// SendBird notification configuration causes some false positive triggers on our firebase
// extension. So we map appropriate actions to seemingly wrong triggers.
function handleNotificationOpenedIOS(notification, dispatch, store) {
  if (Platform.OS !== 'ios') {
    return;
  }

  handleNotificationOpened(notification, dispatch, store);
}

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    SendBird.setForegroundState();
    return;
  }

  SendBird.setBackgroundState();
}

export function appWillMount(app) {
  const store = app.getStore();

  NotificationHandlers.registerTokenReceivedHandler({
    owner: ext(),
    onTokenReceived: SendBird.registerPushToken,
  });

  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: (notification, dispatch) => handleNotificationOpened(notification, dispatch, store),
      onNotificationReceivedBackground: (notification, dispatch) => handleNotificationOpenedIOS(notification, dispatch, store),
      onNotificationReceivedForeground: (notification, dispatch) => handleNotificationOpenedIOS(notification, dispatch, store),
    },
  });
}

export function appDidFinishLaunching(app) {
  const store = app.getStore();
  const state = store.getState();
  const isLoggedIn = isAuthenticated(state);
  const user = getUser(state);
  const extensionSettings = getExtensionSettings(state, ext());
  const { appId } = extensionSettings;

  AppState.addEventListener('change', handleAppStateChange);

  const channelHandlers = {
    onMessageReceived: handlers.onMessageReceivedHandler(store.dispatch, store.getState),
    onChannelChanged: handlers.onChannelChangedHandler(store.dispatch, store.getState),
    onTypingStatusUpdated: handlers.onTypingStatusUpdatedHandler(store.dispatch),
  };

  const connectionHandlers = {
    onReconnectStarted: handlers.onReconnectStarted(store.dispatch),
    onReconnectSucceeded: handlers.onReconnectSucceeded(store.dispatch),
    onReconnectFailed: handlers.onReconnectFailed(store.dispatch),
  };

  if (appId && isLoggedIn) {
    store.dispatch(actions.setConnectionState(CONNECTION_STATUSES.CONNECTING));
    SendBird.init({ appId, user, channelHandlers, connectionHandlers })
      .then(() => {
        store.dispatch(actions.setConnectionState(CONNECTION_STATUSES.CONNECTED));
        SendBird.registerPushToken();
      })
      .catch(() => store.dispatch(actions.setConnectionState(CONNECTION_STATUSES.DISCONNECTED)));
  }
}

export function appWillUnmount() {
  const SendBirdInstance = SendBird.getInstance();

  AppState.removeEventListener('change', handleAppStateChange);

  if (SendBirdInstance) {
    SendBird.disconnect();
  }
}
