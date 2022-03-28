import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Row, View } from '@shoutem/ui';
import { ShimmerPlaceholder } from 'shoutem.layouts';
import { ext } from '../../const';

function CommentViewSkeleton({ style }) {
  return (
    <View style={style.container}>
      <ShimmerPlaceholder style={style.profileImageSkeleton} />
      <View style={style.contentContainer}>
        <Row style={style.row}>
          <View styleName="vertical" style={style.contentInnerContainer}>
            <View styleName="horizontal space-between">
              <ShimmerPlaceholder style={style.userNameSkeleton} />
              <ShimmerPlaceholder
                style={[style.captionLineSkeleton, style.timeAgoWidth]}
              />
            </View>
            <View styleName="md-gutter-top">
              <ShimmerPlaceholder
                style={[style.captionLineSkeleton, style.longContentLineWidth]}
              />
              <ShimmerPlaceholder
                style={[style.captionLineSkeleton, style.shortContentLineWidth]}
              />
              <ShimmerPlaceholder
                style={[style.captionLineSkeleton, style.longContentLineWidth]}
              />
            </View>
          </View>
        </Row>
      </View>
    </View>
  );
}

CommentViewSkeleton.propTypes = {
  style: PropTypes.object,
};

CommentViewSkeleton.defaultProps = {
  style: {},
};

export default connectStyle(ext('CommentViewSkeleton'))(CommentViewSkeleton);
