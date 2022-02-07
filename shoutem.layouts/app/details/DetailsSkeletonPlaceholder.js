import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ShimmerPlaceholder } from '../components';
import { ext } from '../const';

export function DetailsSkeletonPlaceholder({ style }) {
  return (
    <View styleName="flexible">
      <ShimmerPlaceholder style={style.image} />
      <View style={style.contentContainer}>
        <ShimmerPlaceholder style={style.titleLine} />
        <ShimmerPlaceholder style={style.longLine} />
        <ShimmerPlaceholder style={style.shortLine} />
        <ShimmerPlaceholder style={style.longLine} />
        <ShimmerPlaceholder style={style.shortLine} />
      </View>
    </View>
  );
}

DetailsSkeletonPlaceholder.propTypes = {
  style: PropTypes.object,
};

DetailsSkeletonPlaceholder.defaultProps = {
  style: {},
};

export default connectStyle(ext('DetailsSkeletonPlaceholder'))(
  DetailsSkeletonPlaceholder,
);
