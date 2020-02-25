// This file is auto-generated.
import pack from './package.json';

export const THEMES_SCHEMA = 'shoutem.core.themes';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
