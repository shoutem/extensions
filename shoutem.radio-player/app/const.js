import pack from './package.json';

export const RSS_LIST_SCREEN = 'shoutem.rss-news.ArticlesGridScreen';
export const RSS_DETAILS_SCREEN = 'shoutem.rss-news.ArticleDetailsScreen';

export const RADIO_TRACK_IDENTIFIER = 'radio-player';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
