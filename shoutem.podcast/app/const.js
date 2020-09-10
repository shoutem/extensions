import {
  CAPABILITY_PAUSE,
  CAPABILITY_PLAY,
  CAPABILITY_JUMP_FORWARD,
  CAPABILITY_JUMP_BACKWARD,
  CAPABILITY_SEEK_TO,
} from 'shoutem.audio';

import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

// TODO: Currently, backend has no shoutem.proxy.podcast
// schema defined. We can't use news schema, it's causing
// problems if we have both, news and podcast, extensions in app
// (https://fiveminutes.jira.com/browse/SEEXT-8462)
export const RSS_PODCAST_SCHEMA = 'shoutem.proxy.news';
export const PODCAST_SCHEMA_ITEM = 'Podcast';
export const EPISODE_DETAILS_SCREEN = ext('EpisodeDetailsScreen');

export const trackPlayerOptions = {
  stopWithApp: true,
  alwaysPauseOnInterruption: true,
  capabilities: [
    CAPABILITY_SEEK_TO,
    CAPABILITY_JUMP_FORWARD,
    CAPABILITY_JUMP_BACKWARD,
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
  notificationCapabilities: [
    CAPABILITY_SEEK_TO,
    CAPABILITY_JUMP_FORWARD,
    CAPABILITY_JUMP_BACKWARD,
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
  compactCapabilities: [
    CAPABILITY_SEEK_TO,
    CAPABILITY_JUMP_FORWARD,
    CAPABILITY_JUMP_BACKWARD,
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
};
