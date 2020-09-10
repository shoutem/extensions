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
    screen: EPISODE_DETAILS_SCREEN,
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

function getItemId(episodes, uuid) {
  const episode = _.find(episodes, (episode) => {
    return episode.attributes.uuid === uuid;
  });

  return _.get(episode, 'id');
}

function generateNavigationAction(notification, feedUrl, store) {
  return new Promise((resolve) => {
    store
      .dispatch(fetchEpisodesFeed(notification.shortcutId))
      .then(({ payload: { data: episodes } }) => {
        const id = getItemId(episodes, notification.itemId);

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
