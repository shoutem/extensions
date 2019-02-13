import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const API_ENDPOINT = '{feedUrl}/wp-json/wp/v2/posts?page={page}&per_page={perPage}';
export const MEDIA_API_ENDPOINT = '{feedUrl}/wp-json/wp/v2/media?include={include}&per_page={perPage}';
export const WORDPRESS_NEWS_SCHEMA = 'shoutem.wordpress.news';
export const WORDPRESS_MEDIA_SCHEMA = 'shoutem.wordpress.media';
