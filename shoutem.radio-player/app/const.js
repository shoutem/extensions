import { CAPABILITY_PAUSE, CAPABILITY_PLAY } from 'shoutem.audio';
import pack from './package.json';

export const RSS_LIST_SCREEN = 'shoutem.rss-news.ArticlesGridScreen';
export const RSS_DETAILS_SCREEN = 'shoutem.rss-news.ArticleDetailsScreen';

export const trackPlayerOptions = {
  stopWithApp: true,
  alwaysPauseOnInterruption: false,
  capabilities: [CAPABILITY_PLAY, CAPABILITY_PAUSE],
  notificationCapabilities: [CAPABILITY_PLAY, CAPABILITY_PAUSE],
  compactCapabilities: [CAPABILITY_PLAY, CAPABILITY_PAUSE],
};

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
