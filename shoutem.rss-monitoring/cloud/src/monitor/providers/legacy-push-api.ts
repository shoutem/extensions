// send push notification
import request from 'request-promise';
import URI from 'urijs';
import config from '../../shared/config';

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
  shortcutKey: string,
  itemId: string,
  itemSchema: string,
  title: string | null,
  summary: string | null,
) {
  const contentBody = {
    action: {
      type: 'shoutem.application.EXECUTE_SHORTCUT',
      navigationAction: 'shoutem.navigation.OPEN_MODAL',
      shortcutId: `${shortcutKey}`,
      itemId: `${itemId}`,
      itemSchema: `${itemSchema}`,
    },
  };
  const notification = {
    audience: {
      type: 1,
    },
    delivery: 'now',
    content: {
      title,
      summary,
      body: JSON.stringify(contentBody),
    },
  };

  const response = await request(getCreateNotificationRequest(appId, notification));
  if (response.statusCode !== 200) {
    throw new Error(`Response ${response.statusCode}: Unable to create notification for app: ${appId}`);
  }
}
