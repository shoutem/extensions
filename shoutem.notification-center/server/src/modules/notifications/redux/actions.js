import ext from 'src/const';
import { shoutemUrls } from 'src/services';
import { find, invalidate } from '@shoutem/redux-io';
import { NOTIFICATIONS } from '../const';

export function loadNotifications(appId, offset = 0, limit = 10) {
  const params = {
    q: {
      limit: limit,
      offset: offset,
      type: 'Manual',
    },
  };

  const config = {
    schema: NOTIFICATIONS,
    request: {
      endpoint: shoutemUrls.legacyApi(
        `${appId}/notifications/objects/ScheduledNotification{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('notificationsPage'), params);
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
