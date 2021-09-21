import _ from 'lodash';
import { NotificationHandlers } from 'shoutem.firebase';
import { displayLocalNotification } from 'shoutem.rss';
import { openInModal } from 'shoutem.navigation';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { ext, EPISODE_DETAILS_SCREEN, PODCAST_SCHEMA_ITEM } from './const';
import { fetchEpisodesFeed, getFeedUrl } from './redux';

function canHandle(notification) {
  // For now, only rss specific push notifications contain
  // itemSchema property, old notifications don't
  if (
    !notification.itemSchema ||
    notification.itemSchema !== PODCAST_SCHEMA_ITEM
  ) {
    return false;
  }

  return true;
}

function getItemId(episodes, uuid) {
  const episode = _.find(episodes, episode => {
    return episode.attributes.uuid === uuid;
  });

  return _.get(episode, 'id');
}

function consumeNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();
  const feedUrl = getFeedUrl(state, notification.shortcutId);

  store
    .dispatch(fetchEpisodesFeed(notification.shortcutId))
    .then(({ payload: { data: episodes } }) => {
      const id = getItemId(episodes, notification.itemId);

      openInModal(EPISODE_DETAILS_SCREEN, { id, feedUrl });
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
