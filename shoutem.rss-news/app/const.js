// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const RSS_NEWS_SCHEMA = 'shoutem.proxy.news';
export const NEWS_SCHEMA_ITEM = 'News';
export const ARTICLE_DETAILS_SCREEN = ext('ArticleDetailsScreen');
