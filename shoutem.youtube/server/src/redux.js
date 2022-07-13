import _ from 'lodash';
import { createScopedReducer, getShortcutState } from '@shoutem/redux-api-sdk';
import {
  cloneStatus,
  find,
  RESOLVED_ENDPOINT,
  resource,
} from '@shoutem/redux-io';
import {
  createYoutubeChannelUrl,
  createYoutubeValidationUrl,
  isChannelUrl,
  isCustomChannelUrl,
  isPlaylistUrl,
  isUserUrl,
  parseCustomUrl,
  resolveChannelsDataEndpoint,
  resolveChannelsSearchEndpoint,
  resolveUserChannel,
  resolveVideosFetchEndpoint,
  resolveVideosSearchEndpoint,
} from './services';

export const YOUTUBE_API_SETTINGS = 'shoutem.youtube.api-settings';
export const FEED_ITEMS = 'shoutem.youtube.feedItems';
const SEARCH_RESULTS = 'shoutem.youtube.search-results';
const USER = 'shoutem.youtube.user';

export default createScopedReducer({
  shortcut: {
    feedItems: resource(FEED_ITEMS),
  },
});

const resolvedEndpointOptions = {
  [RESOLVED_ENDPOINT]: true,
};

export function validateYoutubeSettings(apiKey) {
  const config = {
    schema: YOUTUBE_API_SETTINGS,
    request: {
      endpoint: createYoutubeValidationUrl(apiKey),
      resourceType: 'json',
      headers: {},
    },
  };

  return find(config, 'validation');
}

function searchVideos(feedUrl, apiKey, shortcutId, order) {
  const endpoint = resolveVideosSearchEndpoint(feedUrl, apiKey, order);

  const config = {
    schema: FEED_ITEMS,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  // Don't fill reducer if playlist url, next request response will do that
  if (isPlaylistUrl(feedUrl)) {
    return find(config);
  }

  return find(config, 'feedItems', { shortcutId }, resolvedEndpointOptions);
}

function fetchCustomChannelSearchResults(feedUrl, apiKey) {
  const endpoint = resolveChannelsSearchEndpoint(feedUrl, apiKey);
  const config = {
    schema: SEARCH_RESULTS,
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
    schema: SEARCH_RESULTS,
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

function fetchVideos(feedUrl, apiKey, videoIds, shortcutId) {
  const endpoint = resolveVideosFetchEndpoint(feedUrl, apiKey, videoIds);
  const config = {
    schema: FEED_ITEMS,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return find(config, 'feedItems', { shortcutId }, resolvedEndpointOptions);
}

function fetchUserChannel(feedUrl, apiKey, shortcutId) {
  const endpoint = resolveUserChannel(feedUrl, apiKey);
  const config = {
    schema: USER,
    request: {
      endpoint,
      resourceType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return find(config, 'userChannel', { shortcutId }, resolvedEndpointOptions);
}

function fetchChannelVideos(feedUrl, apiKey, shortcutId, selectedSort) {
  return dispatch =>
    dispatch(searchVideos(feedUrl, apiKey, shortcutId, selectedSort));
}

function fetchPlaylistVideos(feedUrl, apiKey, shortcutId) {
  return dispatch =>
    dispatch(searchVideos(feedUrl, apiKey, shortcutId)).then(action => {
      const items = _.get(action, 'payload.items');
      const videoIds = _.map(items, item =>
        _.get(item, 'snippet.resourceId.videoId'),
      );

      return dispatch(fetchVideos(feedUrl, apiKey, videoIds, shortcutId));
    });
}

function fetchUserVideos(feedUrl, apiKey, shortcutId, selectedSort) {
  return dispatch =>
    dispatch(fetchUserChannel(feedUrl, apiKey, shortcutId)).then(action => {
      const items = _.get(action, 'payload.items', []);
      const channelId = _.get(items, '0.id');

      const channelUrl = createYoutubeChannelUrl(channelId);

      return dispatch(
        searchVideos(channelUrl, apiKey, shortcutId, selectedSort),
      );
    });
}

function fetchCustomChannelVideos(feedUrl, apiKey, shortcutId, selectedSort) {
  return dispatch =>
    // Fetch first 20 channels, sorted by keyword(customUrl) relevance
    dispatch(fetchCustomChannelSearchResults(feedUrl, apiKey)).then(
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
            const verifiedCustomChannel = _.find(
              channelsData,
              channel => _.get(channel, 'snippet.customUrl') === customUrl,
            );

            if (!verifiedCustomChannel) {
              return null;
            }

            // use channelId to search for videos and sort them by selected sort
            const channelUrl = `youtube.com/channel/${verifiedCustomChannel.id}`;

            return dispatch(
              searchVideos(channelUrl, apiKey, shortcutId, selectedSort),
            );
          },
        );
      },
    );
}

export function loadFeed(feedUrl, apiKey, shortcutId, selectedSort) {
  return dispatch => {
    if (isUserUrl(feedUrl)) {
      return dispatch(
        fetchUserVideos(feedUrl, apiKey, shortcutId, selectedSort),
      );
    }

    if (isChannelUrl(feedUrl)) {
      return dispatch(
        fetchChannelVideos(feedUrl, apiKey, shortcutId, selectedSort),
      );
    }

    if (isPlaylistUrl(feedUrl)) {
      return dispatch(fetchPlaylistVideos(feedUrl, apiKey, shortcutId));
    }

    if (isCustomChannelUrl(feedUrl)) {
      return dispatch(
        fetchCustomChannelVideos(feedUrl, apiKey, shortcutId, selectedSort),
      );
    }

    throw Error('Invalid Url');
  };
}

function createFeedItemInfo(item) {
  const feedItem = _.get(item, 'snippet');
  const feedItemDuration = _.get(item, 'contentDetails');
  const feedItemInfo = {
    id: item.id,
    ...feedItem,
    ...feedItemDuration,
  };

  cloneStatus(feedItem, feedItemDuration, feedItemInfo);
  return feedItemInfo;
}

export function getFeedItems(state, extensionName, shortcutId) {
  const shortcutState = getShortcutState(state, extensionName, shortcutId);
  const feedItems = _.get(shortcutState, 'feedItems');

  if (!feedItems) {
    return [];
  }

  const feedItemInfos = _.map(_.get(feedItems, 'items'), item =>
    createFeedItemInfo(item),
  );
  cloneStatus(feedItems, feedItemInfos);

  return feedItemInfos;
}
