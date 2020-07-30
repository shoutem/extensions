import request from 'request-promise';
import URI from 'urijs';
import config from '../../shared/config';

function getFeedRequest(appId: string, feedUrl: string): object {
  const endpointSuffix = `api/feeds/proxy`;
  const uri = new URI(config.servicesLegacyBackend)
    .segment(endpointSuffix)
    .addQuery('method', 'posts/find')
    .addQuery('invalidateCache', true)
    .addQuery('nid', appId)
    .addQuery('category_id', feedUrl);

  return {
    json: true,
    method: 'GET',
    uri: uri.toString(),
    headers: {
      authorization: `Bearer ${config.servicesApiToken}`,
    },
    resolveWithFullResponse: true,
    simple: false,
  };
}

export async function invalidateLegacyFeed(appId: string, feedUrl: string) {
  const feedRequest = getFeedRequest(appId, feedUrl);
  const response = await request(feedRequest);
  if (response.statusCode !== 200) {
    throw new Error(`Response ${response.statusCode}: Unable to invalidate feed ${feedUrl} for app: ${appId}`);
  }
}
