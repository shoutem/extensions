// This file is auto-generated.
import pack from './package.json';

export const GROUP_PREFIX = 'group.';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
