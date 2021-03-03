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

function resolveNavigationAction(store, id, feedUrl) {
  const route = {
    screen: ARTICLE_DETAILS_SCREEN,
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

function getItemId(articles, uuid) {
  const article = _.find(articles, article => {
    return article.attributes.uuid === uuid;
  });

  return _.get(article, 'id');
}

function generateNavigationAction(notification, feedUrl, store) {
  return new Promise(resolve => {
    store
      .dispatch(fetchNewsFeed(notification.shortcutId))
      .then(({ payload: { data: articles } }) => {
        const id = getItemId(articles, notification.itemId);

        resolve(resolveNavigationAction(store, id, feedUrl));
      });
    // eslint-disable-next-line no-console
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
    navigationAction => {
      displayLocalNotification(
        notification.title,
        notification.body,
        navigationAction,
        store,
      );
    },
  );
}

function openItemInModal(notification, store) {
  const state = store.getState();
  const feedUrl = getFeedUrl(state, notification.shortcutId);
  generateNavigationAction(notification, feedUrl, store).then(
    navigationAction => {
      store.dispatch(navigationAction);
    },
  );
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
      onNotificationTapped: notification =>
        handleNotificationTapped(notification, store),
      onNotificationReceivedForeground: notification =>
        handleForegroundNotification(notification, store),
      onPendingNotificationDispatched: notification =>
        handlePendingNotification(notification, store),
    },
  });
}
