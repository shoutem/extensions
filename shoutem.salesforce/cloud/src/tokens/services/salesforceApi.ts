import _ from 'lodash';
import Uri from 'urijs';

const TOKEN_SCOPE = 'list_and_subscribers_read list_and_subscribers_write offline';

export function getObtainSalesforceTokensRequest(grantCode: string, extensionInstallation: object): object {
  const extensionSettings = _.get(extensionInstallation, 'data.attributes.settings', {});
  const appId = _.get(extensionInstallation, 'data.attributes.app');
  const canonicalName = _.get(extensionInstallation, 'data.attributes.canonicalName');
  
  const { authBaseUri, clientId, services } = extensionSettings;
  const cloudUrl = new Uri(services.core.cloud).origin();

  const body = {
    grant_type: 'authorization_code',
    code: grantCode,
    client_id: clientId,
    redirect_uri: `${cloudUrl}/shoutem.salesforce/v1/${appId}/redirect?canonicalName=${canonicalName}`,
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
