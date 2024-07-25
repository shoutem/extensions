import { Platform } from 'react-native';
import _ from 'lodash';
import { Firebase, NotificationHandlers } from 'shoutem.firebase';
import { getCurrentRoute, openInModal } from 'shoutem.navigation';
import { ext } from './const';
import { selectors } from './redux';

function handleNotificationOpened(notification, _dispatch, store) {
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

function handleNotificationReceived(notification) {
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

export function registerNotificationHandlers(store) {
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationReceivedForeground: notification =>
        handleNotificationReceived(notification),
      onNotificationTapped: (notification, dispatch) =>
        handleNotificationOpened(notification, dispatch, store),
    },
  });
}

export function registerBackgroundMessageHandler() {
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationReceivedBackground: notification =>
        handleNotificationReceived(notification),
    },
  });
}
