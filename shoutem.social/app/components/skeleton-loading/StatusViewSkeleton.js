import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ShimmerPlaceholder } from 'shoutem.layouts';
import { ext } from '../../const';

function StatusViewSkeleton({ style }) {
  return (
    <View style={style.statusItemContainerSkeleton}>
      <View styleName="horizontal v-center space-between md-gutter">
        <View styleName="horizontal flex-start v-center">
          <ShimmerPlaceholder style={style.profileImageSkeleton} />
          <View styleName="vertical">
            <ShimmerPlaceholder style={style.userNameSkeleton} />
            <ShimmerPlaceholder style={style.timeAgoSkeleton} />
          </View>
        </View>
        <View styleName="md-gutter-vertical md-gutter-left" />
      </View>
      <ShimmerPlaceholder style={[style.contentLineSkeleton, style.longLine]} />
      <ShimmerPlaceholder
        style={[style.contentLineSkeleton, style.shortLine]}
      />
      <ShimmerPlaceholder style={[style.contentLineSkeleton, style.longLine]} />
      <View style={style.emptySpace} />
    </View>
  );
}

StatusViewSkeleton.propTypes = {
  style: PropTypes.object,
};

StatusViewSkeleton.defaultProps = {
  style: {},
};

export default connectStyle(ext('StatusViewSkeleton'))(StatusViewSkeleton);
