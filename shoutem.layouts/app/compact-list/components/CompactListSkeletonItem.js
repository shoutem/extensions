import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Divider, Row, View } from '@shoutem/ui';
import { ShimmerPlaceholder } from '../../components';
import { ext } from '../../const';

function CompactListSkeletonItem({ style }) {
  return (
    <View>
      <Row>
        <ShimmerPlaceholder style={style.image} />
        <View styleName="vertical stretch space-between">
          <ShimmerPlaceholder style={style.shortLine} />
          <ShimmerPlaceholder style={style.longLine} />
          <ShimmerPlaceholder style={style.dateStampLine} />
        </View>
      </Row>
      <Divider styleName="line" />
    </View>
  );
}

CompactListSkeletonItem.propTypes = {
  style: PropTypes.object,
};

CompactListSkeletonItem.defaultProps = {
  style: {},
};

export default connectStyle(ext('CompactListSkeletonItem'))(
  CompactListSkeletonItem,
);
