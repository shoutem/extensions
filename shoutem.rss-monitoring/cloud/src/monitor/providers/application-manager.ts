import request from 'request-promise';
import URI from 'urijs';
import config from '../../shared/config';

function getShortcutsRequest(appId: string): object {
  const endpointSuffix = `/v1/apps/${appId}/shortcuts`;
  return {
    json: true,
    method: 'GET',
    uri: new URI(config.servicesAppBackend).segment(endpointSuffix).toString(),
    headers: {
      Accept: 'application/vnd.api+json',
      authorization: `Bearer ${config.servicesApiToken}`,
    },
    resolveWithFullResponse: true,
    timeout: 30000,
    simple: false,
  };
}

export async function getShortcuts(appId: string): Promise<any> {
  const response = await request(getShortcutsRequest(appId));

  if (response.statusCode !== 200) {
    throw new Error(`Response ${response.statusCode}: Unable to fetch shortcuts for app: ${appId}`);
  }

  return response.body;
}
