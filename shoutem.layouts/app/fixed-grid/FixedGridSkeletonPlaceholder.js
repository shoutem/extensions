import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ShimmerPlaceholder } from '../components';
import { ext } from '../const';
import { FixedGridSkeletonItem } from './components';

function FixedGridSkeletonPlaceholder({ hasFeaturedItem, style }) {
  return (
    <View styleName="flexible">
      {hasFeaturedItem && <ShimmerPlaceholder style={style.featuredItem} />}
      <View styleName="paper flexible sm-gutter-top">
        <View styleName="horizontal space-around sm-gutter-horizontal">
          <FixedGridSkeletonItem style={style} />
          <FixedGridSkeletonItem style={style} />
        </View>
        <View styleName="horizontal space-around sm-gutter">
          <FixedGridSkeletonItem style={style} />
          <FixedGridSkeletonItem style={style} />
        </View>
      </View>
    </View>
  );
}

FixedGridSkeletonPlaceholder.propTypes = {
  hasFeaturedItem: PropTypes.bool,
  style: PropTypes.object,
};

FixedGridSkeletonPlaceholder.defaultProps = {
  hasFeaturedItem: false,
  style: {},
};

export default connectStyle(ext('FixedGridSkeletonPlaceholder'))(
  FixedGridSkeletonPlaceholder,
);
