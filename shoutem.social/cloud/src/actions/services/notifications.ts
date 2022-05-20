import _ from 'lodash';
import request from 'request-promise';
import URI from 'urijs';
import { Request } from 'express';
import config from '../../shared/config';
import { shouldSendNotification, SETTINGS_PARAMS_KEYS } from '../../settings';
import { SOCIAL_ACTION_TYPES, NOTIFICATION_TITLES, SOCIAL_NOTIFICATION_TYPES } from '../const';

function formatNotificationTitle(userName: string, actionType: SOCIAL_ACTION_TYPES): string {
  const suffix = actionType === SOCIAL_ACTION_TYPES.LIKE ? NOTIFICATION_TITLES.LIKE : NOTIFICATION_TITLES.COMMENT;

  return `${userName}${suffix}`;
}

function getCreateNotificationRequest(appId: string, notification: object): object {
  const endpointSuffix = `/${appId}/notifications/objects/ScheduledNotification/`;

  return {
    json: true,
    method: 'POST',
    uri: new URI(config.servicesLegacyBackend).segment(endpointSuffix).toString(),
    headers: {
      Accept: 'application/vnd.api+json',
      authorization: `Bearer ${config.servicesApiToken}`,
    },
    body: notification,
    resolveWithFullResponse: true,
    simple: false,
  };
}

export async function createNotification(
  appId: string,
  socialActionType: SOCIAL_ACTION_TYPES,
  userName: string,
  targetId: string,
) {
  const title = formatNotificationTitle(userName, socialActionType);

  const notification = {
    audience: {
      type: 'user',
      userId: targetId,
    },
    delivery: 'now',
    content: {
      title,
    },
    type:
      socialActionType === SOCIAL_ACTION_TYPES.LIKE
        ? SOCIAL_NOTIFICATION_TYPES.LIKE
        : SOCIAL_NOTIFICATION_TYPES.COMMENT,
  };

  const response = await request(getCreateNotificationRequest(appId, notification));

  if (response.statusCode !== 200) {
    throw new Error(`Response ${response.statusCode}: Unable to create notification for app: ${appId}`);
  }
}

export async function dispatchNotification(req: Request, socialActionType: SOCIAL_ACTION_TYPES): Promise<void> {
  const { data } = req.body;
  const { appId, authorId, username } = data;

  const controlParam =
    socialActionType === SOCIAL_ACTION_TYPES.LIKE
      ? SETTINGS_PARAMS_KEYS.LIKES_ON_MY_STATUSES
      : SETTINGS_PARAMS_KEYS.COMMENTS_ON_MY_STATUSES;
  const sendNotification = await shouldSendNotification(authorId, controlParam);

  if (sendNotification) {
    return createNotification(appId, socialActionType, username, authorId);
  }
}
