import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Row, View } from '@shoutem/ui';
import { ShimmerPlaceholder } from '../../components';
import { ext } from '../../const';

function LargeListSkeletonItem({ style }) {
  return (
    <View styleName="paper md-gutter-bottom">
      <ShimmerPlaceholder style={style.image} />
      <Row>
        <View styleName="vertical stretch space-between">
          <ShimmerPlaceholder style={style.shortLine} />
          <ShimmerPlaceholder style={style.longLine} />
          <ShimmerPlaceholder style={style.dateStampLine} />
        </View>
      </Row>
    </View>
  );
}

LargeListSkeletonItem.propTypes = {
  style: PropTypes.object,
};

LargeListSkeletonItem.defaultProps = {
  style: {},
};

export default connectStyle(ext('LargeListSkeletonItem'))(
  LargeListSkeletonItem,
);
