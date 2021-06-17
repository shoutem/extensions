import _ from 'lodash';
import {
  USER_REGEX,
  CUSTOM_CHANNEL_REGEX,
  RESOURCE_TYPES,
  CHANNEL_REGEX,
  PLAYLIST_REGEX,
  PLAYLIST_ID_PARAM_REGEX,
} from '../const';

export function resolveGoogleApisEndpoint(type, query) {
  const baseApiEndpoint = `https://www.googleapis.com/youtube/v3/${type}`;

  if (query) {
    return `${baseApiEndpoint}?${query}`;
  }

  return baseApiEndpoint;
}

export function parseCustomUrl(feedUrl) {
  return feedUrl.match(CUSTOM_CHANNEL_REGEX)[1];
}

export function createYoutubeChannelUrl(channelId) {
  return `https://www.youtube.com/channel/${channelId}`;
}

export function isPlaylistUrl(feedUrl) {
  return PLAYLIST_REGEX.test(feedUrl);
}

/**
 * This regex will extract the parameter id from a YouTube channel link, for example,
 * for the link https://www.youtube.com/channel/UCrJs_gMaJZDqN6Wz76FQ35A,
 * regex will result with UCrJs_gMaJZDqN6Wz76FQ35A.
 */
export function extractChannelId(feedUrl) {
  // eslint-disable-next-line max-len
  return _.get(feedUrl.match(CHANNEL_REGEX), 1);
}

/**
 * This regex will extract the parameter id from a YouTube playlist link, for example,
 * for the link https://www.youtube.com/watch?v=2jAoKF2heDE&list=PLjVnDc2oPyOGBOb75V8CpeSr9Gww8pZdL,
 * regex will result with UCrJs_gMaJZDqN6Wz76FQ35A.
 */
export function extractPlaylistId(feedUrl) {
  return _.get(feedUrl.match(PLAYLIST_ID_PARAM_REGEX), 1);
}

export function resolveUserChannelUrl(feedUrl, apiKey) {
  const userId = feedUrl.match(USER_REGEX)[1];
  const queryString = `part=id&forUsername=${userId}&key=${apiKey}`;

  return resolveGoogleApisEndpoint(RESOURCE_TYPES.CHANNELS, queryString);
}

export function resolveChannelsSearchEndpoint(feedUrl, apiKey) {
  const customUrl = parseCustomUrl(feedUrl);
  const queryString = `part=id,snippet&maxResults=20&type=channel&q=${customUrl}&key=${apiKey}`;

  return resolveGoogleApisEndpoint(RESOURCE_TYPES.SEARCH, queryString);
}

export function resolveChannelsDataEndpoint(ids, apiKey) {
  const stringifiedIds = _.join(ids);
  const queryString = `part=id,snippet,contentDetails&id=${stringifiedIds}maxResults=20&key=${apiKey}`;

  return resolveGoogleApisEndpoint(RESOURCE_TYPES.CHANNELS, queryString);
}
