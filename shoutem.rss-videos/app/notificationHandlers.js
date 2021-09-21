import _ from 'lodash';
import { NotificationHandlers } from 'shoutem.firebase';
import { openInModal } from 'shoutem.navigation';
import { displayLocalNotification } from 'shoutem.rss';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { ext, VIDEO_DETAILS_SCREEN, VIDEOS_SCHEMA_ITEM } from './const';
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
    return video.attributes.uuid === uuid;
  });

  return _.get(video, 'id');
}

function consumeNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();
  const feedUrl = getFeedUrl(state, notification.shortcutId);

  store
    .dispatch(fetchVideosFeed(notification.shortcutId))
    .then(({ payload: { data: videos } }) => {
      const id = getItemId(videos, notification.itemId);

      openInModal(VIDEO_DETAILS_SCREEN, { id, feedUrl });
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
