import React from 'react';
import PropTypes from 'prop-types';
import {
  CompactListSkeletonPlaceholder,
  FixedGridSkeletonPlaceholder,
  LargeListSkeletonPlaceholder,
  LAYOUT_TYPES,
  TileListSkeletonPlaceholder,
} from 'shoutem.layouts';

export default function SkeletonLoading({ hasFeaturedItem, listType }) {
  if (
    listType === LAYOUT_TYPES.FIXED_GRID ||
    listType === LAYOUT_TYPES.GRID_LIST
  ) {
    return <FixedGridSkeletonPlaceholder hasFeaturedItem={hasFeaturedItem} />;
  }

  if (listType === LAYOUT_TYPES.TILE_LIST) {
    return <TileListSkeletonPlaceholder />;
  }

  if (listType === LAYOUT_TYPES.LARGE_LIST) {
    return <LargeListSkeletonPlaceholder />;
  }

  return <CompactListSkeletonPlaceholder hasFeaturedItem={hasFeaturedItem} />;
}

SkeletonLoading.propTypes = {
  hasFeaturedItem: PropTypes.bool.isRequired,
  listType: PropTypes.string.isRequired,
};
