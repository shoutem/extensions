import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Card, View } from '@shoutem/ui';
import { ShimmerPlaceholder } from '../../components';
import { ext } from '../../const';

function FixedGridSkeletonItem({ style }) {
  return (
    <Card style={style.card}>
      <ShimmerPlaceholder style={style.image} />
      <View styleName="flexible content">
        <ShimmerPlaceholder style={style.shortLine} />
        <ShimmerPlaceholder style={style.longLine} />
        <ShimmerPlaceholder style={style.shortLine} />
        <ShimmerPlaceholder style={style.dateStampLine} />
      </View>
    </Card>
  );
}

FixedGridSkeletonItem.propTypes = {
  style: PropTypes.object,
};

FixedGridSkeletonItem.defaultProps = {
  style: PropTypes.object,
};

export default connectStyle(ext('FixedGridSkeletonItem'))(
  FixedGridSkeletonItem,
);
