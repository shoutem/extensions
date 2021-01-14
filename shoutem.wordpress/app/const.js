// This file is auto-generated.
import pack from './package.json';

export const POSTS_PER_PAGE = 20;

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
