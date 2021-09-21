import _ from 'lodash';
import { NotificationHandlers } from 'shoutem.firebase';
import { openInModal } from 'shoutem.navigation';
import { displayLocalNotification } from 'shoutem.rss';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { ext, ARTICLE_DETAILS_SCREEN, NEWS_SCHEMA_ITEM } from './const';
import { fetchNewsFeed, getFeedUrl } from './redux';

function canHandle(notification) {
  // For now, only rss specific push notifications contain
  // itemSchema property, old notifications don't
  if (
    !notification.itemSchema ||
    notification.itemSchema !== NEWS_SCHEMA_ITEM
  ) {
    return false;
  }

  return true;
}

function getItemId(articles, uuid) {
  const article = _.find(articles, article => {
    return article.attributes.uuid === uuid;
  });

  return _.get(article, 'id');
}

function consumeNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();
  const feedUrl = getFeedUrl(state, notification.shortcutId);

  store
    .dispatch(fetchNewsFeed(notification.shortcutId))
    .then(({ payload: { data: articles } }) => {
      const id = getItemId(articles, notification.itemId);

      openInModal(ARTICLE_DETAILS_SCREEN, { id, feedUrl });
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
