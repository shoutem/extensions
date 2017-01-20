import rio from '@shoutem/redux-io';
import { buildFeedUrl } from 'shoutem.rss';

import ArticlesGridScreen from './screens/ArticlesGridScreen';
import ArticlesFeaturedListScreen from './screens/ArticlesFeaturedListScreen';
import ArticlesListScreen from './screens/ArticlesListScreen';
import ArticleDetailsScreen from './screens/ArticleDetailsScreen';
import ArticleMediumDetailsScreen from './screens/ArticleMediumDetailsScreen';
import reducer, { RSS_NEWS_SCHEMA } from './redux';

const screens = {
  ArticlesListScreen,
  ArticlesFeaturedListScreen,
  ArticlesGridScreen,
  ArticleDetailsScreen,
  ArticleMediumDetailsScreen,
};

export {
  reducer,
  screens,
};

export function appWillMount(app) {
  const state = app.getState();

  // Configure the RSS news schema in RIO
  rio.registerSchema({
    schema: RSS_NEWS_SCHEMA,
    request: {
      endpoint: buildFeedUrl(state, RSS_NEWS_SCHEMA),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  });
}
