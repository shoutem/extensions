import _ from 'lodash';
import { GridRow } from '@shoutem/ui';
import {
  FixedGridProducts,
  Grid122Products,
  LargeListProducts,
  MediumListProducts,
  TileListProducts,
} from '../fragments';

export const LAYOUTS = {
  GRID122: '1-2-2-grid',
  FIXED_GRID: 'fixed-grid',
  MEDIUM_LIST: 'medium-list',
  LARGE_LIST: 'large-list',
  TILE_LIST: 'tile-list',
};

export const LAYOUT_COMPONENTS = {
  [LAYOUTS.GRID122]: Grid122Products,
  [LAYOUTS.FIXED_GRID]: FixedGridProducts,
  [LAYOUTS.MEDIUM_LIST]: MediumListProducts,
  [LAYOUTS.LARGE_LIST]: LargeListProducts,
  [LAYOUTS.TILE_LIST]: TileListProducts,
};

export function resolveLayoutComponent(listType) {
  if (_.includes(_.values(LAYOUTS), listType)) {
    return LAYOUT_COMPONENTS[listType];
  }

  return LAYOUT_COMPONENTS[LAYOUTS.FIXED_GRID];
}

export function mapDataForGridLayout(data, hasFeaturedItem) {
  let isFirstItem = hasFeaturedItem;

  return GridRow.groupByRows(data, 2, () => {
    if (isFirstItem) {
      isFirstItem = false;
      return 2;
    }

    return 1;
  });
}

export function mapDataFor122Layout(data) {
  let count = 0;

  // Every 5th item should be featured
  const rows = GridRow.groupByRows(data, 2, () => {
    if (count % 5 === 0) {
      count++;
      return 2;
    }

    count++;
    return 1;
  });

  // Update data so that only every 3rd row is featured
  return _.reduce(
    rows,
    (res, rowItems, index) => {
      if (index % 3 === 0 || index === 0) {
        const featuredItem = _.map(rowItems, item => ({
          ...item,
          isFeatured: true,
        }));

        return [...res, featuredItem];
      }

      return [...res, rowItems];
    },
    [],
  );
}
