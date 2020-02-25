// This file is auto-generated.
import pack from './package.json';

export const API_ENDPOINT = '{feedUrl}/wp-json/wp/v2/posts?page={page}&per_page={perPage}';
export const MEDIA_API_ENDPOINT = '{feedUrl}/wp-json/wp/v2/media?include={include}&per_page={perPage}';
export const AUTHOR_API_ENDPOINT = '{feedUrl}/wp-json/wp/v2/users?include={include}&per_page={perPage}';

export const WORDPRESS_NEWS_SCHEMA = 'shoutem.wordpress.news';
export const WORDPRESS_MEDIA_SCHEMA = 'shoutem.wordpress.media';
export const WORDPRESS_AUTHOR_SCHEMA = 'shoutem.wordpress.author';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
