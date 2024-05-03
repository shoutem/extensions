import { ext } from 'context';
import { appId, url } from 'environment';
import { find } from '@shoutem/redux-io';
import { NOTIFICATIONS } from '../types';

export function createNotification(notification) {
  return dispatch => {
    const config = {
      schema: NOTIFICATIONS,
      request: {
        endpoint: `//${url.legacy}/${appId}/notifications/objects/ScheduledNotification`,
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
        },
        body: JSON.stringify(notification),
      },
    };

    return dispatch(find(config, ext('notification-create')));
  };
}
