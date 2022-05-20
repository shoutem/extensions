// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const ARTICLE_DETAILS_SCREEN = ext('ArticleDetailsScreen');
export const ARTICLES_LIST_SCREEN = ext('ArticlesListScreen');
export const DEFAULT_PAGE_LIMIT = 20;
export const NEWS_SCHEMA_ITEM = 'News';
export const RSS_NEWS_SCHEMA = 'shoutem.proxy.news';
export const NEWS_COLLECTION_TAG = 'latestNews';
