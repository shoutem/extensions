import { Alert } from 'react-native';
import _ from 'lodash';
import { getShortcut } from 'shoutem.application';
import { NotificationHandlers } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { openInModal } from 'shoutem.navigation';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { displayLocalNotification, ext as rssExt } from 'shoutem.rss';
import {
  EPISODE_DETAILS_SCREEN,
  EPISODES_LIST_SCREEN,
  ext,
  PODCAST_SCHEMA_ITEM,
} from './const';
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
    return episode.id === uuid;
  });

  return _.get(episode, 'id');
}

function consumeNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  const { itemId, shortcutId } = notification;
  const { dispatch } = store;
  const state = store.getState();
  const feedUrl = getFeedUrl(state, shortcutId);

  dispatch(fetchEpisodesFeed(shortcutId, { pageLimit: 100 })).then(
    ({ payload: { data: episodes } }) => {
      const id = getItemId(episodes, itemId);

      // When we can't find notification item in the feed, we want to at least
      // open the relevant Podcast list screen for a better UX.
      if (!id) {
        const shortcut = getShortcut(state, shortcutId);

        openInModal(EPISODES_LIST_SCREEN, { shortcut });

        Alert.alert(
          I18n.t(rssExt('itemNotFoundTitle')),
          I18n.t(rssExt('itemNotFoundMessage')),
        );

        return;
      }

      openInModal(EPISODE_DETAILS_SCREEN, { id, feedUrl });
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
