// This file is auto-generated.
import pack from './package.json';

export const PAGE_SIZE = 25;

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
