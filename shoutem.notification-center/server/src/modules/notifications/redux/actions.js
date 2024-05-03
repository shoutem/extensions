import ext from 'src/const';
import { shoutemUrls } from 'src/services';
import Uri from 'urijs';
import { find, invalidate } from '@shoutem/redux-io';
import { NOTIFICATIONS } from '../const';

export function loadNotifications(appId, offset = 0, limit = 10) {
  const baseUrl = shoutemUrls.legacyApi(
    `${appId}/notifications/objects/ScheduledNotification`,
  );
  const uri = new Uri(baseUrl)
    .addQuery('limit', limit)
    .addQuery('offset', offset)
    .addQuery('type', 'Manual')
    .addQuery('type', 'Cms')
    .addQuery('type', 'Rss');

  const config = {
    schema: NOTIFICATIONS,
    request: {
      endpoint: uri.toString(),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('notificationsPage'));
}

export function createNotification(appId, notification) {
  return dispatch => {
    const config = {
      schema: NOTIFICATIONS,
      request: {
        endpoint: shoutemUrls.legacyApi(
          `${appId}/notifications/objects/ScheduledNotification`,
        ),
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
        },
        body: JSON.stringify(notification),
      },
    };

    return dispatch(find(config, ext('notificationsPage-create'))).then(() => {
      dispatch(invalidate(NOTIFICATIONS));
    });
  };
}

export function updateNotification(appId, notificationId, updatePatch) {
  return dispatch => {
    const item = {
      id: notificationId,
      ...updatePatch,
    };

    const config = {
      schema: NOTIFICATIONS,
      request: {
        endpoint: shoutemUrls.legacyApi(
          `${appId}/notifications/objects/ScheduledNotification/${notificationId}`,
        ),
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
        },
        body: JSON.stringify(item),
      },
    };

    return dispatch(find(config, ext('notificationsPage-update'))).then(() => {
      dispatch(invalidate(NOTIFICATIONS));
    });
  };
}

export function deleteNotification(appId, notificationId) {
  return dispatch => {
    const config = {
      schema: NOTIFICATIONS,
      request: {
        endpoint: shoutemUrls.legacyApi(
          `${appId}/notifications/objects/ScheduledNotification/${notificationId}`,
        ),
        method: 'DELETE',
        headers: {
          Accept: 'application/vnd.api+json',
        },
      },
    };

    return dispatch(find(config, ext('notificationsPage-delete'))).then(() => {
      dispatch(invalidate(NOTIFICATIONS));
    });
  };
}
