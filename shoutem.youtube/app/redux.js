import _ from 'lodash';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import URI from 'urijs';
import { mapReducers } from '@shoutem/redux-composers';
import {
  find,
  LOAD_ERROR,
  LOAD_SUCCESS,
  resource,
  STATUS,
} from '@shoutem/redux-io';
import { isAppendMode } from '@shoutem/redux-io/actions/find';
import Outdated from '@shoutem/redux-io/outdated';
import {
  canHandleAction,
  createInitialStatus,
} from '@shoutem/redux-io/reducers/resource';
import {
  busyStatus,
  setStatus,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import {
  API_ENDPOINT,
  CHANNEL_REGEX,
  CUSTOM_CHANNEL_REGEX,
  ext,
  PLAYLIST_REGEX,
  RESOURCE_TYPES,
  USER_REGEX,
} from './const';
import {
  createYoutubeChannelUrl,
  ERROR_TYPE,
  extractChannelId,
  extractPlaylistId,
  parseCustomUrl,
  resolveChannelsDataEndpoint,
  resolveChannelsSearchEndpoint,
  resolveUserChannelUrl,
  resolveYoutubeError,
} from './services';

export const YOUTUBE_VIDEOS_SCHEMA = ext('videos');
const YOUTUBE_CHANNELS_SCHEMA = ext('channels');
const YOUTUBE_SEARCH_SCHEMA = ext('search');

/**
 * Check if there is another page of youtube videos
 * @param {Object} payload Current action payload that contain list of Youtube videos
 * @return {Boolean}
 */
function hasNextPage(payload) {
  return !!_.get(payload, 'nextPageToken');
}

function getNextActionParams(action) {
  const actionParams = _.get(action, 'meta.params', {});
  const { query, ...otherParams } = actionParams;

  return {
    ...query,
    ...otherParams,
    pageToken: _.get(action, 'payload.nextPageToken'),
  };
}

function getNextActionEndpoint(action) {
  const params = getNextActionParams(action);
  const { type, ...otherParams } = params;

  const endpointUri = new URI(API_ENDPOINT.replace(/{type}/g, type));
  const resolvedParams = { ...endpointUri.query(true), ...otherParams };

  return endpointUri.query(resolvedParams).toString();
}

/**
 * Get next action links object
 * @param {Object} action Current dispatched action object
 * @return {Object}
 */
function getNextActionLinks(action) {
  return {
    next: getNextActionEndpoint(action),
  };
}

function getFeedUrlFromAction(action) {
  return (
    // Initial request's 'feedUrl' has this path
    _.get(action, ['meta', 'params', 'query', 'feedUrl']) ||
    // When loading next pages, 'feedUrl' is on this path
    _.get(action, ['meta', 'params', 'feedUrl'])
  );
}

export function youtubeResource(schema, initialState = []) {
  // eslint-disable-next-line no-param-reassign
  setStatus(initialState, createInitialStatus(schema));
  const outdated = new Outdated();

  // Create default resource reducer instance
  const defaultResourceReducer = resource(schema, initialState);

  return (state = initialState, action) => {
    if (!canHandleAction(action, schema)) {
      return state;
    }
    if (outdated.isOutdated(action)) {
      return state;
    }
    outdated.reportChange(action);

    const { payload } = action;

    if (action.type === LOAD_SUCCESS) {
      if (!_.isObject(payload)) {
        return state;
      }

      const newItems = _.get(payload, 'items', []);
      const newState = isAppendMode(action)
        ? [...state, ...newItems]
        : [...newItems];
      const links = hasNextPage(payload) ? getNextActionLinks(action) : {};
      const params = hasNextPage(payload) ? getNextActionParams(action) : {};

      setStatus(
        newState,
        updateStatus(state[STATUS], {
          validationStatus: validationStatus.VALID,
          busyStatus: busyStatus.IDLE,
          error: false,
          links,
          params,
          schema,
        }),
      );
      return newState;
    }

    return defaultResourceReducer(state, action);
  };
}

export default (state, action) => {
  // We want to preserve the state on rehydrate action
  // We can't just add REHYDRATE action responder inside reducer,
  // because resource reducers are created too late, only after first
  // LOAD_SUCCESS
  if (action.type === REHYDRATE) {
    return { ..._.get(action, ['payload', ext()]) };
  }

  if (action.type === LOAD_ERROR) {
    return resolveStatePerError(state, action);
  }

  const reducer = combineReducers({
    videos: mapReducers(
      getFeedUrlFromAction,
      youtubeResource(YOUTUBE_VIDEOS_SCHEMA),
    ),
  });

  return reducer(state, action);
};

function resolveStatePerError(state, action) {
  const yotubeError = resolveYoutubeError(action);

  if (yotubeError?.type === ERROR_TYPE.API_POINTS_LIMIT_REACHED) {
    const newState = { ...state };

    _.forEach(newState.videos, reducer => {
      setStatus(
        reducer,
        updateStatus(state[STATUS], {
          validationStatus: validationStatus.INVALID,
          busyStatus: busyStatus.IDLE,
          error: true,
        }),
      );
    });

    return newState;
  }

  return state;
}

export function getVideosFeed(state, feedUrl) {
  return _.get(state[ext()], ['videos', feedUrl]);
}

function searchForCustomChannel(feedUrl, apiKey) {
  const endpoint = resolveChannelsSearchEndpoint(feedUrl, apiKey);

  const config = {
    schema: YOUTUBE_SEARCH_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return find(config);
}

function fetchChannelsData(channelsIds, apiKey) {
  const endpoint = resolveChannelsDataEndpoint(channelsIds, apiKey);

  const config = {
    schema: YOUTUBE_CHANNELS_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return find(config);
}

function fetchUserChannel(feedUrl, apiKey) {
  const endpoint = resolveUserChannelUrl(feedUrl, apiKey);

  const config = {
    schema: YOUTUBE_CHANNELS_SCHEMA,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return find(config);
}

function fetchChannelVideosSearchResults(feedUrl, apiKey, sort, reducerName) {
  const params = {
    type: RESOURCE_TYPES.SEARCH,
    query: {
      maxResults: 20,
      part: 'id,snippet',
      channelId: extractChannelId(feedUrl),
      type: 'video',
      order: sort,
      key: apiKey,
      feedUrl: reducerName,
    },
  };

  return find(YOUTUBE_VIDEOS_SCHEMA, undefined, params);
}

function fetchUserVideos(feedUrl, apiKey, sort) {
  return dispatch =>
    dispatch(fetchUserChannel(feedUrl, apiKey)).then(action => {
      const channelId = _.get(action, 'payload.items.0.id');
      const channelUrl = createYoutubeChannelUrl(channelId);

      return dispatch(
        fetchChannelVideosSearchResults(channelUrl, apiKey, sort, feedUrl),
      );
    });
}

function fetchCustomChannelVideos(feedUrl, apiKey, sort) {
  return dispatch =>
    // Fetch first 20 channels, sorted by keyword(customUrl) relevance
    dispatch(searchForCustomChannel(feedUrl, apiKey)).then(
      channelSearchResultsResponse => {
        const channels = _.get(
          channelSearchResultsResponse,
          'payload.items',
          [],
        );
        const channelsIds = _.map(channels, 'id.channelId');
        // Fetch more detailed channel data on our ~20 results
        return dispatch(fetchChannelsData(channelsIds, apiKey)).then(
          channelsDataResponse => {
            const customUrl = parseCustomUrl(feedUrl);
            const channelsData = _.get(channelsDataResponse, 'payload.items');
            // Find a channel with exact custom URL our feed URL contains
            const verifiedCustomChannel = _.find(channelsData, channel => {
              return _.get(channel, 'snippet.customUrl') === customUrl;
            });

            if (!verifiedCustomChannel) {
              return null;
            }

            const channelUrl = createYoutubeChannelUrl(
              verifiedCustomChannel.id,
            );

            return dispatch(
              fetchChannelVideosSearchResults(
                channelUrl,
                apiKey,
                sort,
                feedUrl,
              ),
            );
          },
        );
      },
    );
}

function playlistFeedThunk(feedUrl, apiKey) {
  return dispatch => {
    const params = {
      type: RESOURCE_TYPES.PLAYLIST,
      query: {
        maxResults: 20,
        part: 'snippet,contentDetails',
        playlistId: extractPlaylistId(feedUrl),
        key: apiKey,
        feedUrl,
      },
    };

    return dispatch(find(YOUTUBE_VIDEOS_SCHEMA, undefined, params));
  };
}

export function fetchFeed(feedUrl, apiKey, sort) {
  return dispatch => {
    if (USER_REGEX.test(feedUrl)) {
      return dispatch(fetchUserVideos(feedUrl, apiKey, sort));
    }

    if (CUSTOM_CHANNEL_REGEX.test(feedUrl)) {
      return dispatch(fetchCustomChannelVideos(feedUrl, apiKey, sort));
    }

    if (CHANNEL_REGEX.test(feedUrl)) {
      return dispatch(
        fetchChannelVideosSearchResults(feedUrl, apiKey, sort, feedUrl),
      );
    }

    if (PLAYLIST_REGEX.test(feedUrl)) {
      return dispatch(playlistFeedThunk(feedUrl, apiKey));
    }

    return null;
  };
}
