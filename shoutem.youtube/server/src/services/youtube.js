import i18next from 'i18next';
import _ from 'lodash';
import URI from 'urijs';
import validator from 'validator';
import LOCALIZATION from '../localization';

export const feedSortOptions = [
  { name: 'relevance', title: 'Relevance' },
  { name: 'date', title: 'Date' },
  { name: 'rating', title: 'Rating' },
  { name: 'title', title: 'Title' },
  { name: 'viewCount', title: 'View count' },
];

// channelId is going to be extracted if matches the regex function
const userRegex = /(?:http:\/\/|https:\/\/|www\.|^)youtube\.com\/user\/([a-zA-Z0-9_-]{1,})/i;
const channelRegex = /(?:http:\/\/|https:\/\/|www\.|^)youtube\.com\/channel\/([a-zA-Z0-9_-]{1,})/i;
const playlistRegex = /(?:http:\/\/|https:\/\/|www\.|^)youtube\.com\/(?:playlist|watch)\?(^|.*)list=([a-zA-Z0-9_-]{1,})/i;
const playlistIdParamRegex = /list=([a-zA-Z0-9_-]{1,})/i;
const customChannelRegex = /(?:http:\/\/|https:\/\/|www\.|^)youtube\.com\/c\/([a-zA-Z0-9_-]{1,})/i;

export function isChannelUrl(feedUrl) {
  return channelRegex.test(feedUrl);
}

export function isUserUrl(feedUrl) {
  return userRegex.test(feedUrl);
}

export function isPlaylistUrl(feedUrl) {
  return playlistRegex.test(feedUrl);
}

export function isCustomChannelUrl(feedUrl) {
  return customChannelRegex.test(feedUrl);
}

export function parseCustomUrl(feedUrl) {
  return feedUrl.match(customChannelRegex)[1];
}

export function extractPlaylistId(feedUrl) {
  return _.get(feedUrl.match(playlistIdParamRegex), 1);
}

function resolveApiEndpoint(type, params) {
  return new URI(`https://www.googleapis.com/youtube/v3/${type}`)
    .query(params)
    .toString();
}

export function resolveChannelsSearchEndpoint(feedUrl, apiKey) {
  const customUrl = parseCustomUrl(feedUrl);
  return resolveApiEndpoint('search', {
    part: 'id,snippet',
    maxResults: 20,
    type: 'channel',
    q: customUrl,
    key: apiKey,
  });
}

export function resolveChannelsDataEndpoint(ids, apiKey) {
  return resolveApiEndpoint('channels', {
    part: 'id,snippet,contentDetails',
    maxResults: 20,
    key: apiKey,
    id: _.join(ids, ','),
  });
}

export function resolveVideosSearchEndpoint(
  feedUrl,
  apiKey,
  order = 'relevance',
) {
  if (isChannelUrl(feedUrl)) {
    const channelId = feedUrl.match(channelRegex)[1];

    return resolveApiEndpoint('search', {
      part: 'id,snippet',
      maxResults: 20,
      key: apiKey,
      channelId,
      order,
      type: 'video',
    });
  }

  if (isPlaylistUrl(feedUrl)) {
    const playlistId = extractPlaylistId(feedUrl);
    feedUrl.match(playlistRegex)[1];

    return resolveApiEndpoint('playlistItems', {
      part: 'id,snippet,contentDetails',
      maxResults: 20,
      key: apiKey,
      playlistId,
    });
  }

  return null;
}

export function resolveUserChannel(feedUrl, apiKey) {
  if (isUserUrl(feedUrl)) {
    const userId = feedUrl.match(userRegex)[1];
    return resolveApiEndpoint('channels', {
      part: 'id,snippet,contentDetails',
      maxResults: 20,
      key: apiKey,
      forUsername: userId,
    });
  }
  return null;
}

export function resolveVideosFetchEndpoint(feedUrl, apiKey, videoIds) {
  const videoIdsStr = videoIds.join();

  if (isChannelUrl(feedUrl)) {
    const channelId = feedUrl.match(channelRegex)[1];

    return resolveApiEndpoint('videos', {
      part: 'id,snippet,contentDetails',
      maxResults: 20,
      key: apiKey,
      id: videoIdsStr,
      channelId,
    });
  }

  if (isPlaylistUrl(feedUrl)) {
    const playlistId = feedUrl.match(playlistRegex)[1];
    return resolveApiEndpoint('videos', {
      part: 'id,snippet,contentDetails',
      maxResults: 20,
      key: apiKey,
      id: videoIdsStr,
      playlistId,
    });
  }

  return null;
}

export function createYoutubeValidationUrl(apiKey) {
  return resolveApiEndpoint('channels', {
    part: 'id,snippet',
    key: apiKey,
    id: 'UCK8sQmJBp8GCxrOtXWBpyEA',
  });
}

export function createYoutubeChannelUrl(channelId) {
  return `https://www.youtube.com/channel/${channelId}`;
}

const validateUrl = url => validator.isURL(url, { require_protocol: false });

export function validateYoutubeUrl(url) {
  if (!url || !validateUrl(url)) {
    return false;
  }

  if (
    isChannelUrl(url) ||
    isUserUrl(url) ||
    isPlaylistUrl(url) ||
    isCustomChannelUrl(url)
  ) {
    return true;
  }

  return false;
}

export function resolveYoutubeError(errorResponse) {
  const error = errorResponse.payload.response?.error;

  if (
    !!error &&
    error?.code === 403 &&
    error?.errors[0].domain === 'youtube.quota' &&
    error.errors[0].reason === 'quotaExceeded'
  ) {
    return i18next.t(LOCALIZATION.API_POINTS_LIMIT_REACHED_ERROR_MESSAGE);
  }

  return error?.errors?.[0]?.reason;
}
