import request from 'request-promise';
import URI from 'urijs';
import _ from 'lodash';
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

function getAppSubscriptionStatusRequest(appId: string): object {
  const endpointSuffix = `/v1/apps/${appId}/subscription-status`;
  // no need for PROD configuration as apps don't need to be published
  const appBackendUrl = _.replace(config.servicesAppBackend, 'prod.', '');

  return {
    json: true,
    method: 'GET',
    uri: new URI(appBackendUrl).segment(endpointSuffix).toString(),
    headers: {
      Accept: 'application/vnd.api+json',
      authorization: `Bearer ${config.servicesApiToken}`,
    },
    resolveWithFullResponse: true,
    timeout: 30000,
    simple: false,
  };
}

export async function getAppSubscriptionStatus(appId: string): Promise<any> {
  const response = await request(getAppSubscriptionStatusRequest(appId));

  if (response.statusCode === 404) {
    const errorCode = _.get(response.body, 'errors.[0].code');
    if (errorCode === 'am_application_notFound_appError') {
      return null;
    }

    throw new Error(`Response ${response.statusCode}: Unable to fetch subscription status for app: ${appId}`);
  }

  if (response.statusCode !== 200) {
    throw new Error(`Response ${response.statusCode}: Unable to fetch subscription status for app: ${appId}`);
  }

  return response.body;
}
