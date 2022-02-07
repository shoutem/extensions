import _ from 'lodash';
import URI from 'urijs';
import config from '../../shared/config';

function createEndpoint(appId: string, path: string): string {
  const endpointSuffix = `/v1/apps/${appId}/installations/${path}`;

  return new URI(config.servicesAppBackendDebug).segment(endpointSuffix).toString();
}

export function getFetchExtensionInstallationRequest(appId: string): object {
  return {
    method: 'GET',
    uri: createEndpoint(appId, 'shoutem.salesforce'),
    headers: {
      Accept: 'application/vnd.api+json',
      authorization: `Bearer ${config.servicesApiToken}`,
    },
    resolveWithFullResponse: true,
  };
}

export function getSalesforceAuthorizedRequest(appId: string, extensionInstallation: object): object {
  const installationId = _.get(extensionInstallation, 'data.id');
  const body = {
    data: {
      type: "shoutem.core.installations",
      id: installationId,
      attributes: {
        settings: {
          salesforceAuthorized: true,
        }
      }
    }
  };

  return {
    method: 'PATCH',
    uri: createEndpoint(appId, installationId),
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      authorization: `Bearer ${config.servicesApiToken}`,
    },
    body: JSON.stringify(body),
    resolveWithFullResponse: true,
  };
}
