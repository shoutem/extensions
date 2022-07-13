import request from 'request-promise';
import URI from 'urijs';
import _ from 'lodash';
import config from '../../shared/config';

function getLastFeedRequest(appId: string, schema: string, url: string): object {
  const endpointSuffix = `/v1/apps/${appId}/proxy/resources/${schema}`;

  const uri = new URI(config.servicesProxyBackend).segment(endpointSuffix);
  uri.addQuery('filter[url]', url);
  uri.addQuery('page[limit]', 1);

  return {
    json: true,
    method: 'GET',
    uri: uri.toString(),
    headers: {
      Accept: 'application/vnd.api+json',
    },
    resolveWithFullResponse: true,
    simple: false,
  };
}

function resolveSchema(feedType: string): string | null {
  if (feedType === 'News' || feedType === 'Podcast') {
    return 'shoutem.proxy.news';
  }

  if (feedType === 'Photo') {
    return 'shoutem.proxy.photos';
  }

  if (feedType === 'Video') {
    return 'shoutem.proxy.videos';
  }

  return 'shoutem.proxy.news';
}

export async function getLastFeedItem(appId: string, feedType: string, feedUrl: string): Promise<any> {
  const schema = resolveSchema(feedType);
  if (!schema) {
    throw new Error(`Unable to resolve schema for app: ${appId}, feedType: ${feedType}`);
  }

  if (!feedUrl) {
    return null;
  }

  const response = await request(getLastFeedRequest(appId, schema, feedUrl));
  if (response.statusCode !== 200) {
    throw new Error(
      `Response ${response.statusCode}: Unable to fetch feed for
       app: ${appId}, feedType: ${feedType}, feedUrl: ${feedUrl}`,
    );
  }

  const lastFeedItem = _.first(_.get(response.body, 'data'));
  if (!lastFeedItem) {
    return null;
  }

  const item = {
    id: _.get(lastFeedItem, 'id'),
    ..._.get(lastFeedItem, 'attributes'),
  };

  return item;
}
