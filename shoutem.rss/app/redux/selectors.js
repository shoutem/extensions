import { getAppId, getExtensionServiceUrl } from 'shoutem.application';

// Builds the RSS feed proxy URL for the given feed schema
export function buildFeedUrl(state, schema) {
  const appId = getAppId();
  const proxyApiEndpoint = getExtensionServiceUrl(
    state,
    'shoutem.application',
    'proxy',
  );

  return `${proxyApiEndpoint}/v1/apps/${appId}/proxy/resources/${schema}{?query*}`;
}
