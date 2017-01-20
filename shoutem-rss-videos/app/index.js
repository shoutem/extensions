import VideosList from './screens/VideosList.js';
import VideosSmallList from './screens/SmallVideosList.js';
import VideoDetails from './screens/VideoDetails.js';
import reducer, { RSS_VIDEOS_SCHEMA } from './redux';

import rio from '@shoutem/redux-io';
import { buildFeedUrl } from 'shoutem.rss';

export const screens = {
  VideosList,
  VideosSmallList,
  VideoDetails,
};

export { reducer };

export function appWillMount(app) {
  const state = app.getState();

  // Configure the RSS schema in RIO
  rio.registerSchema({
    schema: RSS_VIDEOS_SCHEMA,
    request: {
      endpoint: buildFeedUrl(state, RSS_VIDEOS_SCHEMA),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
