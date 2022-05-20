import { Alert } from 'react-native';
import _ from 'lodash';
import { NotificationHandlers } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { openInModal } from 'shoutem.navigation';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { displayLocalNotification, ext as rssExt } from 'shoutem.rss';
import {
  ext,
  PHOTO_DETAILS_SCREEN,
  PHOTOS_LIST_SCREEN,
  PHOTOS_SCHEMA_ITEM,
} from './const';
import { fetchPhotosFeed, getFeedUrl, getPhotosFeed } from './redux';
import { remapAndFilterPhotos } from './services';

function canHandle(notification) {
  // For now, only rss specific push notifications contain
  // itemSchema property, old notifications don't
  if (
    !notification.itemSchema ||
    notification.itemSchema !== PHOTOS_SCHEMA_ITEM
  ) {
    return false;
  }

  return true;
}

function getItemId(state, feedUrl, uuid) {
  const data = getPhotosFeed(state, feedUrl);
  const photos = remapAndFilterPhotos(data);
  const photo = _.find(photos, photo => {
    return photo.id === uuid;
  });

  return photo?.id;
}

function consumeNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  const { itemId, shortcutId } = notification;
  const { dispatch } = store;
  const state = store.getState();
  const feedUrl = getFeedUrl(state, shortcutId);

  dispatch(fetchPhotosFeed(shortcutId, { pageLimit: 100 })).then(() => {
    const id = getItemId(state, feedUrl, itemId);

    if (!id) {
      openInModal(PHOTOS_LIST_SCREEN, { shortcutId });

      Alert.alert(
        I18n.t(rssExt('itemNotFoundTitle')),
        I18n.t(rssExt('itemNotFoundMessage')),
      );

      return;
    }

    openInModal(PHOTO_DETAILS_SCREEN, { id, feedUrl });
  });
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
