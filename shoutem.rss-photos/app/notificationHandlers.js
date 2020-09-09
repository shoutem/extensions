import _ from 'lodash';
import { NotificationHandlers } from 'shoutem.firebase';
import {
  hasModalOpen,
  openInModal,
  navigateTo,
  getNavigationInitialized,
} from 'shoutem.navigation';
import {
  setPendingNotification,
  displayLocalNotification,
  resolveNotificationData,
} from 'shoutem.push-notifications';
import { ext, PHOTO_DETAILS_SCREEN, PHOTOS_SCHEMA_ITEM } from './const';
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

function openItemInModal(notification, store) {
  const state = store.getState();
  const feedUrl = getFeedUrl(state, notification.shortcutId);
  generateNavigationAction(notification, feedUrl, store).then(
    (navigationAction) => {
      store.dispatch(navigationAction);
    },
  );
}

function resolveNavigationAction(store, id, feedUrl) {
  const route = {
    screen: PHOTO_DETAILS_SCREEN,
    props: {
      id,
      feedUrl,
    },
  };

  const state = store.getState();
  const alreadyHasModalOpen = hasModalOpen(state);
  const navigationAction = alreadyHasModalOpen ? navigateTo : openInModal;

  return navigationAction(route);
}

function handleNotificationTapped(receivedNotification, store) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();
  const navigationInitialized = getNavigationInitialized(state);

  if (!navigationInitialized) {
    store.dispatch(setPendingNotification(notification));
    return;
  }

  openItemInModal(notification, store);
}

function getItemId(state, feedUrl, uuid) {
  const data = getPhotosFeed(state, feedUrl);
  const photos = remapAndFilterPhotos(data);
  const photo = _.find(photos, (photo) => {
    return photo.uuid === uuid;
  });

  return _.get(photo, 'id');
}

function generateNavigationAction(notification, feedUrl, store) {
  return new Promise((resolve) => {
    store.dispatch(fetchPhotosFeed(notification.shortcutId)).then(() => {
      const state = store.getState();
      const id = getItemId(state, feedUrl, notification.itemId);

      resolve(resolveNavigationAction(store, id, feedUrl));
    });
  }).catch(err => console.warn('Resolve navigation action failed.', err));
}

function handleForegroundNotification(receivedNotification, store) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();
  const feedUrl = getFeedUrl(state, notification.shortcutId);
  generateNavigationAction(notification, feedUrl, store).then(
    (navigationAction) => {
      displayLocalNotification(
        notification.title,
        notification.body,
        navigationAction,
        store,
      );
    },
  );
}

function handlePendingNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  openItemInModal(notification, store);
}

export function registerNotificationHandlers(store) {
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: (notification) =>
        handleNotificationTapped(notification, store),
      onNotificationReceivedForeground: (notification) =>
        handleForegroundNotification(notification, store),
      onPendingNotificationDispatched: (notification) =>
        handlePendingNotification(notification, store),
    },
  });
}
