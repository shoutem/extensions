import rio from '@shoutem/redux-io';

import { buildFeedUrl } from 'shoutem.rss';

import { RSS_PODCAST_SCHEMA } from './redux';

export function appDidMount(app) {
  const state = app.getState();

  // Configure the RSS podcast schema in RIO
  rio.registerResource({
    schema: RSS_PODCAST_SCHEMA,
    request: {
      endpoint: buildFeedUrl(state, RSS_PODCAST_SCHEMA),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
