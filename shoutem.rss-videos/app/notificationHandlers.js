import { Alert } from 'react-native';
import _ from 'lodash';
import { getShortcut } from 'shoutem.application';
import { NotificationHandlers } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { openInModal } from 'shoutem.navigation';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { displayLocalNotification, ext as rssExt } from 'shoutem.rss';
import {
  ext,
  VIDEO_DETAILS_SCREEN,
  VIDEOS_LIST_SCREEN,
  VIDEOS_SCHEMA_ITEM,
} from './const';
import { fetchVideosFeed, getFeedUrl } from './redux';

function canHandle(notification) {
  // For now, only rss specific push notifications contain
  // itemSchema property, old notifications don't
  if (
    !notification.itemSchema ||
    notification.itemSchema !== VIDEOS_SCHEMA_ITEM
  ) {
    return false;
  }

  return true;
}

function getItemId(videos, uuid) {
  const video = _.find(videos, video => {
    return video.id === uuid;
  });

  return video?.id;
}

function consumeNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  const { itemId, shortcutId } = notification;
  const { dispatch } = store;
  const state = store.getState();
  const feedUrl = getFeedUrl(state, shortcutId);

  dispatch(fetchVideosFeed(shortcutId)).then(
    ({ payload: { data: videos } }) => {
      const id = getItemId(videos, itemId);

      if (!id) {
        const shortcut = getShortcut(state, shortcutId);

        openInModal(VIDEOS_LIST_SCREEN, { shortcut });

        Alert.alert(
          I18n.t(rssExt('itemNotFoundTitle')),
          I18n.t(rssExt('itemNotFoundMessage')),
        );

        return;
      }

      openInModal(VIDEO_DETAILS_SCREEN, { id, feedUrl });
    },
  );
}

function handleForegroundNotification(receivedNotification, store) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  displayLocalNotification(notification.title, notification.body, () =>
    consumeNotification(notification, store),
  );
}

function handleNotificationTapped(receivedNotification, store) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  consumeNotification(notification, store);
}

export function registerNotificationHandlers(store) {
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: notification =>
        handleNotificationTapped(notification, store),
      onNotificationReceivedForeground: notification =>
        handleForegroundNotification(notification, store),
      onConsumeNotification: notification =>
        consumeNotification(notification, store),
    },
  });
}
