import { Alert } from 'react-native';
import _ from 'lodash';
import { invalidate } from '@shoutem/redux-io';
import { Toast } from '@shoutem/ui';
import { getShortcut } from 'shoutem.application';
import { NotificationHandlers } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { openInModal } from 'shoutem.navigation';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { displayLocalNotification, ext as rssExt } from 'shoutem.rss';
import {
  EPISODE_DETAILS_SCREEN,
  EPISODE_TAG,
  EPISODES_COLLECTION_TAG,
  EPISODES_LIST_SCREEN,
  ext,
  PODCAST_SCHEMA_ITEM,
  RSS_PODCAST_SCHEMA,
} from './const';
import { fetchEpisodesFeed, getFeedMetaForOneEpisode } from './redux';

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

function consumeNotification(notification, store) {
  if (!canHandle(notification)) {
    return;
  }

  const { itemId, shortcutId } = notification;
  const { dispatch } = store;
  const state = store.getState();
  const shortcut = getShortcut(state, shortcutId);

  dispatch(
    fetchEpisodesFeed(
      shortcutId,
      {
        id: itemId,
      },
      EPISODE_TAG,
    ),
  )
    .then(response => {
      const episode = _.get(response, 'payload.data[0]', null);

      // When we can't find notification item in the feed, we want to at least
      // open the relevant Podcast list screen for a better UX.
      if (!episode) {
        // At this point, collection will be valid, even tho episode was not found.
        // Invalidate collection so that it can load normally (first 20) when list screen is opened.
        dispatch(invalidate(RSS_PODCAST_SCHEMA, EPISODES_COLLECTION_TAG)).then(
          () => {
            openInModal(EPISODES_LIST_SCREEN, { shortcut });

            Alert.alert(
              I18n.t(rssExt('itemNotFoundTitle')),
              I18n.t(rssExt('itemNotFoundMessage')),
            );
          },
        );

        return;
      }

      openInModal(EPISODE_DETAILS_SCREEN, {
        id: episode.id,
        shortcutId: shortcut.id,
        meta: getFeedMetaForOneEpisode(state),
        screenSettings: _.find(
          shortcut.screens,
          screen => screen.canonicalType === EPISODE_DETAILS_SCREEN,
        )?.settings,
        analyticsPayload: {
          itemId: episode.id,
          itemName: episode.title,
        },
      });
    })
    .catch(() =>
      Toast.showError({
        title: I18n.t(ext('fetchFailedTitle')),
        message: I18n.t(ext('fetchFailedMessage')),
      }),
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
