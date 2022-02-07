import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ShimmerPlaceholder } from '../components';
import { ext } from '../const';
import { CompactListSkeletonItem } from './components';

export function CompactListSkeletonPlaceholder({ hasFeaturedItem, style }) {
  return (
    <View styleName="flexible">
      {hasFeaturedItem && <ShimmerPlaceholder style={style.featuredItem} />}
      <View styleName="paper flexible">
        <CompactListSkeletonItem style={style} />
        <CompactListSkeletonItem style={style} />
        <CompactListSkeletonItem style={style} />
      </View>
    </View>
  );
}

CompactListSkeletonPlaceholder.propTypes = {
  hasFeaturedItem: PropTypes.bool,
  style: PropTypes.object,
};

CompactListSkeletonPlaceholder.defaultProps = {
  hasFeaturedItem: false,
  style: {},
};

export default connectStyle(ext('CompactListSkeletonPlaceholder'))(
  CompactListSkeletonPlaceholder,
);
