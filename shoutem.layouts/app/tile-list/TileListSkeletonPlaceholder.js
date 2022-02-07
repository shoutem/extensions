import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ShimmerPlaceholder } from '../components';
import { ext } from '../const';

function TileListSkeletonPlaceholder({ style }) {
  return (
    <View styleName="flexible">
      <View styleName="flexible">
        <ShimmerPlaceholder style={style.itemContainer} />
        <ShimmerPlaceholder style={style.itemContainer} />
        <ShimmerPlaceholder style={style.itemContainer} />
      </View>
    </View>
  );
}

TileListSkeletonPlaceholder.propTypes = {
  style: PropTypes.object,
};

TileListSkeletonPlaceholder.defaultProps = {
  style: {},
};

export default connectStyle(ext('TileListSkeletonPlaceholder'))(
  TileListSkeletonPlaceholder,
);
