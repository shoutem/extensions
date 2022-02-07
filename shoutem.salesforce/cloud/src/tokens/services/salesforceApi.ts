import _ from 'lodash';

const TOKEN_SCOPE = 'list_and_subscribers_read list_and_subscribers_write offline';

export function getObtainSalesforceTokensRequest(grantCode: string, extensionInstallation: object): object {
  const extensionSettings = _.get(extensionInstallation, 'data.attributes.settings', {});
  const appId = _.get(extensionInstallation, 'data.attributes.app');
  const { authBaseUri, clientId, services } = extensionSettings;

  const body = {
    grant_type: "authorization_code",
    code: grantCode,
    client_id: clientId,
    redirect_uri: `${services.self.cloud}/v1/${appId}/redirect`,
    scope: TOKEN_SCOPE,
  };

  return {
    method: 'POST',
    uri: `${authBaseUri}v2/token`,
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

export function getRefreshSalesforceTokenRequest(refreshToken: string, extensionInstallation: object): object {
  const extensionSettings = _.get(extensionInstallation, 'data.attributes.settings', {});
  const { authBaseUri, clientId } = extensionSettings;

  const body = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    scope: TOKEN_SCOPE,
  };

  return {
    method: 'POST',
    uri: `${authBaseUri}v2/token`,
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}
