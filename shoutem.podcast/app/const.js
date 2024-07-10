import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const DOWNLOADED_EPISODE_ADDED = ext('DOWNLOADED_EPISODE_ADDED');
export const DOWNLOADED_EPISODE_REMOVED = ext('DOWNLOADED_EPISODE_REMOVED');
export const DOWNLOADED_EPISODE_UPDATED = ext('DOWNLOADED_EPISODE_UPDATED');
export const SET_DOWNLOAD_IN_PROGRESS = ext('SET_DOWNLOAD_IN_PROGRESS');
export const UPDATE_LAST_PLAYED = ext('UPDATE_LAST_PLAYED');

// TODO: Currently, backend has no shoutem.proxy.podcast
// schema defined. We can't use news schema, it's causing
// problems if we have both, news and podcast, extensions in app
// (https://fiveminutes.jira.com/browse/SEEXT-8462)
export const RSS_PODCAST_SCHEMA = 'shoutem.proxy.news';
export const EPISODES_COLLECTION_TAG = 'latestEpisodes';
export const EPISODE_CHECK_TAG = 'episodeCheck';
export const PODCAST_SCHEMA_ITEM = 'Podcast';
export const DEFAULT_PAGE_LIMIT = 20;
export const EPISODES_LIST_SCREEN = ext('EpisodesListScreen');
export const EPISODE_DETAILS_SCREEN = ext('EpisodeDetailsScreen');

export const PODCAST_TRACK_IDENTIFIER = 'podcast';
export const getEpisodeTrackId = id => `${PODCAST_TRACK_IDENTIFIER}-${id}`;
