// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const LAYOUT_TYPES = {
  COMPACT_LIST: 'compact-list',
  FIXED_GRID: 'fixed-grid',
  GRID_LIST: 'grid-list',
  LARGE_LIST: 'large-list',
  TILE_LIST: 'tile-list',
};
