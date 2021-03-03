import _ from 'lodash';
import { createScopedReducer, getShortcutState } from '@shoutem/redux-api-sdk';
import {
  resource,
  find,
  cloneStatus,
  RESOLVED_ENDPOINT,
} from '@shoutem/redux-io';
import ext from './const';
import {
  createCategoryFilter,
  extractBaseUrl,
  toLocalDateTime,
} from './services';

export const CATEGORIES_SCHEMA = 'shoutem.wordpress.categories';
export const FEED_ITEMS = 'shoutem.wordpress.feedItems';
export const WORD_PRESS_MEDIA_SCHEMA = 'shoutem.wordpress.media';

export default createScopedReducer({
  shortcut: {
    feedItems: resource(FEED_ITEMS),
    media: resource(WORD_PRESS_MEDIA_SCHEMA),
  },
});

const resolvedEndpointOptions = {
  [RESOLVED_ENDPOINT]: true,
};

export function getPostsMediaParams(posts) {
  return {
    include: _.filter(_.map(posts, 'featured_media'), mediaId => !!mediaId),
  };
}

export function getCategories({ feedUrl, shortcutId }) {
  const baseUrl = extractBaseUrl(feedUrl);
  const endpoint = `${baseUrl}/wp-json/wp/v2/categories`;

  const config = {
    schema: CATEGORIES_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  return find(config, undefined, { shortcutId }, resolvedEndpointOptions);
}

export function loadPosts({ feedUrl, shortcutId, categories = [] }) {
  const baseUrl = extractBaseUrl(feedUrl);
  const categoriesFilter = createCategoryFilter(feedUrl, categories);
  const endpoint = `${baseUrl}/wp-json/wp/v2/posts${categoriesFilter}`;

  const config = {
    schema: FEED_ITEMS,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  return find(
    config,
    ext('feedItems'),
    { shortcutId },
    resolvedEndpointOptions,
  );
}

// eslint-disable-next-line camelcase
function loadPostsMedia({ feedUrl, posts, per_page, appendMode = false }) {
  const baseUrl = extractBaseUrl(feedUrl);

  const config = {
    schema: WORD_PRESS_MEDIA_SCHEMA,
    request: {
      endpoint: `${baseUrl}/wp-json/wp/v2/media`,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  return find(
    config,
    ext('feedItemsMedia'),
    {
      ...getPostsMediaParams(posts),
      per_page,
    },
    { feedUrl, appendMode },
  );
}

export function fetchWordPressPosts(params) {
  return dispatch =>
    dispatch(getCategories(params))
      .then(({ payload }) =>
        dispatch(loadPosts({ ...params, categories: payload })),
      )
      .then(action => {
        const { payload: posts } = action;

        return dispatch(loadPostsMedia({ ...params, posts })).then(
          () => action,
        );
      });
}

export function navigateToUrl(url) {
  return {
    type: '@@navigator/NAVIGATE_REQUEST',
    payload: {
      component: 'external',
      options: { url },
    },
  };
}

function createFeedItemInfo(feedItem, shortcutState) {
  const mediaList = _.get(shortcutState, 'media');
  const dateTime = toLocalDateTime(feedItem.date);
  const { dateTimeDisplay, dateTimeFormatted } = dateTime;

  if (feedItem.featured_media) {
    // eslint-disable-next-line
    feedItem.featured_media_object = _.first(
      _.filter(mediaList, media => media.id === feedItem.featured_media),
    );
  }

  const feedItemInfo = {
    ...feedItem,
    dateTimeFormatted,
    dateTimeDisplay,
  };

  cloneStatus(feedItem, feedItemInfo);
  return feedItemInfo;
}

export function getFeedItems(state, extensionName, shortcutId) {
  const shortcutState = getShortcutState(state, extensionName, shortcutId);
  const feedItems = _.get(shortcutState, 'feedItems');

  if (!feedItems) {
    return [];
  }

  const feedItemInfos = _.map(feedItems, item =>
    createFeedItemInfo(item, shortcutState),
  );
  cloneStatus(feedItems, feedItemInfos);
  return feedItemInfos;
}
