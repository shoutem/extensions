// This file is auto-generated.
import pack from './package.json';

export const PAGE_SCHEMA = ext('Page');

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
