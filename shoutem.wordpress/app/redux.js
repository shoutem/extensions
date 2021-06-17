import _ from 'lodash';
import { combineReducers } from 'redux';
import URI from 'urijs';
import { mapReducers } from '@shoutem/redux-composers';
import { APPEND_MODE } from '@shoutem/redux-io/actions/find';
import Outdated from '@shoutem/redux-io/outdated';
import {
  busyStatus,
  createStatus,
  setStatus,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import {
  cloneStatus,
  find,
  LOAD_SUCCESS,
  resource,
  STATUS,
} from '@shoutem/redux-io';
import {
  getActionCurrentPage,
  getResponseTotalPages,
} from './services/pagination';
import { ext, POSTS_PER_PAGE } from './const';
import { createCategoryFilter, extractBaseUrl } from './services';

export const CATEGORIES_ENDPOINT = '{feedUrl}/wp-json/wp/v2/categories';
export const API_ENDPOINT =
  '{feedUrl}/wp-json/wp/v2/posts?page={page}&per_page={perPage}';
export const MEDIA_API_ENDPOINT =
  '{feedUrl}/wp-json/wp/v2/media?include={include}&per_page={perPage}';
export const AUTHOR_API_ENDPOINT =
  '{feedUrl}/wp-json/wp/v2/users?include={include}&per_page={perPage}';

export const WORDPRESS_CATEGORIES_SCHEMA = 'shoutem.wordpress.categories';
export const WORDPRESS_NEWS_SCHEMA = 'shoutem.wordpress.news';
export const WORDPRESS_MEDIA_SCHEMA = 'shoutem.wordpress.media';
export const WORDPRESS_AUTHOR_SCHEMA = 'shoutem.wordpress.author';

export function resolveCategoriesUrl(feedUrl) {
  const baseUrl = extractBaseUrl(feedUrl);

  return CATEGORIES_ENDPOINT.replace('{feedUrl}', baseUrl);
}

export function resolvePostsUrl(feedUrl) {
  const baseUrl = extractBaseUrl(feedUrl);

  return API_ENDPOINT.replace('{feedUrl}', baseUrl);
}

export function resolvePostsMediaUrl(feedUrl) {
  const baseUrl = extractBaseUrl(feedUrl);

  return MEDIA_API_ENDPOINT.replace('{feedUrl}', baseUrl);
}

export function resolvePostsAuthorUrl(feedUrl) {
  const baseUrl = extractBaseUrl(feedUrl);

  return AUTHOR_API_ENDPOINT.replace('{feedUrl}', baseUrl);
}

// ACTION CREATORS

// eslint-disable-next-line no-unused-vars
export function fetchCategories({ feedUrl, page, appendMode = false }) {
  const config = {
    schema: WORDPRESS_CATEGORIES_SCHEMA,
    request: {
      endpoint: resolveCategoriesUrl(feedUrl),
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  return find(config, undefined, {}, { feedUrl, appendMode });
}

/**
 * Action creator for fetching posts from WordPress v2 API
 * @param {Object} options
 * @param {string} options.feedUrl url to WordPress blog
 * @param {number} options.page page index
 * @param {number} options.perPage number of items in response
 * @param {bool} options.appendMode should returned items be appended to existing state
 * @param {array} options.categories array of category IDs (integer) for given WordPress blog
 */
export function fetchPosts({
  feedUrl,
  page,
  perPage = POSTS_PER_PAGE,
  appendMode = false,
  categories = [],
}) {
  const resolvedUrl = resolvePostsUrl(feedUrl);
  const endpoint = categories.length
    ? `${resolvedUrl}${createCategoryFilter(feedUrl, categories)}`
    : resolvedUrl;

  const config = {
    schema: WORDPRESS_NEWS_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  const params = { page, perPage };

  return find(config, undefined, params, { feedUrl, appendMode });
}

/**
 * Action creator for fetching media from WordPress v2 API
 * @param {Object} options
 * @param {string} options.feedUrl url to WordPress blog
 * @param {Array} options.posts array of posts for related media
 * @param {bool} options.appendMode should returned items be appended to existing state
 */
export function fetchPostsMedia({ feedUrl, posts, appendMode = false }) {
  const featuredMediaIds = _.map(posts, 'featured_media');
  const include = featuredMediaIds.join(',');
  const perPage = featuredMediaIds.length;

  const config = {
    schema: WORDPRESS_MEDIA_SCHEMA,
    request: {
      endpoint: resolvePostsMediaUrl(feedUrl),
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  const params = { include, perPage };

  return find(config, undefined, params, { feedUrl, appendMode });
}

export function fetchPostsAuthor({ feedUrl, posts, appendMode = false }) {
  const authorIds = _.map(posts, 'author');
  const include = authorIds.join(',');
  const perPage = authorIds.length;

  const config = {
    schema: WORDPRESS_AUTHOR_SCHEMA,
    request: {
      endpoint: resolvePostsAuthorUrl(feedUrl),
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  };

  const params = { include, perPage };

  return find(config, undefined, params, { feedUrl, authorIds, appendMode });
}

/**
 * Redux thunk for fetching posts and media one after other
 * @param {Object} options @see fetchPosts
 */
export function fetchWordpressPosts(options, categories) {
  return dispatch =>
    dispatch(fetchPosts({ ...options, categories })).then(action => {
      const posts = _.get(action, 'payload');

      return Promise.all([
        dispatch(fetchPostsMedia({ ...options, posts })),
        dispatch(fetchPostsAuthor({ ...options, posts })),
      ]);
    });
}

// REDUCERS

function createDefaultStatus(schema) {
  return updateStatus(createStatus(), {
    schema,
    type: 'resource',
    id: _.uniqueId(),
  });
}

function createNewState(state) {
  return _.isArray(state) ? [...state] : { ...state };
}

function isActionSchemeValid(action, schema) {
  if (_.get(action, 'meta.schema') !== schema) {
    return false;
  }

  return true;
}

function getNextActionEndpoint(action) {
  const endpointUri = new URI(_.get(action, 'meta.endpoint'));
  const currentPage = getActionCurrentPage(action);
  const totalPages = getResponseTotalPages(_.get(action, 'meta.response'));
  const nextPage = currentPage + 1;

  if (nextPage <= totalPages) {
    endpointUri.setQuery({ page: nextPage });

    return endpointUri.toString();
  }
  return null;
}

function getActionLinks(action) {
  return {
    next: getNextActionEndpoint(action),
  };
}

function getPostsActionLinks(action) {
  if (isActionSchemeValid(action, WORDPRESS_NEWS_SCHEMA)) {
    return getActionLinks(action);
  }

  return {};
}

function readFeedUrlFromAction(action) {
  return _.get(action, ['meta', 'options', 'feedUrl']);
}

/**
 * Reducer for handling WordPress v2 api JSON responses. It acts like resource reducer, but
 * it could append response data to one in the state if action has appendMode set in options
 * @param {string} schema Schema for which reducer is registered
 * @param {Object} initialState
 */
export function wordpressResource(schema, initialState = {}) {
  // eslint-disable-next-line no-param-reassign
  setStatus(initialState, createDefaultStatus(schema));
  const outdated = new Outdated();

  // Create default resource reducer instance
  const defaultResourceReducer = resource(schema, initialState);

  return (state = initialState, action) => {
    if (!isActionSchemeValid(action, schema)) {
      return state;
    }
    if (outdated.isOutdated(action)) {
      return state;
    }
    outdated.reportChange(action);
    const { payload } = action;

    switch (action.type) {
      case LOAD_SUCCESS: {
        if (!_.isObject(payload)) {
          return state;
        }

        let newState = createNewState(payload);
        const isAppendMode = _.get(action, ['meta', 'options', APPEND_MODE]);
        const links = getPostsActionLinks(action);

        if (_.isArray(payload) && isAppendMode) {
          newState = _.concat(state, newState);
        }

        setStatus(
          newState,
          updateStatus(state[STATUS], {
            validationStatus: validationStatus.VALID,
            busyStatus: busyStatus.IDLE,
            error: false,
            links,
            schema,
          }),
        );
        return newState;
      }
      default:
        return defaultResourceReducer(state, action);
    }
  };
}

export default combineReducers({
  posts: mapReducers(
    readFeedUrlFromAction,
    wordpressResource(WORDPRESS_NEWS_SCHEMA),
  ),
  media: mapReducers(
    readFeedUrlFromAction,
    wordpressResource(WORDPRESS_MEDIA_SCHEMA),
  ),
  categories: mapReducers(
    readFeedUrlFromAction,
    wordpressResource(WORDPRESS_CATEGORIES_SCHEMA),
  ),
  author: mapReducers(
    readFeedUrlFromAction,
    wordpressResource(WORDPRESS_AUTHOR_SCHEMA),
  ),
});

// SELECTORS

/**
 * Redux state selector which selects featured media for provided item and returns item with
 * prepoplated featured media item
 * @param {Object} item one WordPress feed item
 * @param {Object} state redux app state
 * @param {string} feedUrl WordPress feed url
 */
export function getFeedItemInfo(item, state, feedUrl) {
  const mediaList = _.get(state, [ext(), 'media', feedUrl]);
  const authorList = _.get(state, [ext(), 'author', feedUrl]);
  const itemInfo = { ...item };

  if (itemInfo.featured_media) {
    itemInfo.featured_media_object = _.find(mediaList, [
      'id',
      itemInfo.featured_media,
    ]);
  }

  if (itemInfo.author) {
    itemInfo.author_object = _.find(authorList, ['id', itemInfo.author]);
  }

  return itemInfo;
}

/**
 * Redux state selector for getting feed items with prepopulated featured media items
 * @param {Object} state
 * @param {*} feedUrl
 */
export function getFeedItems(state, feedUrl) {
  const feedItems = _.get(state, [ext(), 'posts', feedUrl]);
  if (!feedItems) {
    return [];
  }
  const feedItemsInfo = _.map(feedItems, item =>
    getFeedItemInfo(item, state, feedUrl),
  );
  cloneStatus(feedItems, feedItemsInfo);

  return feedItemsInfo;
}

export function getFeedCategories(state, feedUrl) {
  const feedCategories = _.get(state, [ext(), 'categories', feedUrl], []);

  return feedCategories;
}
