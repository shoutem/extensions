import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';
import { LargeListSkeletonItem } from './components';

function LargeListSkeletonPlaceholder({ style }) {
  return (
    <View styleName="flexible">
      <View styleName="flexible">
        <LargeListSkeletonItem style={style} />
        <LargeListSkeletonItem style={style} />
      </View>
    </View>
  );
}

LargeListSkeletonPlaceholder.propTypes = {
  style: PropTypes.object,
};

LargeListSkeletonPlaceholder.defaultProps = {
  style: {},
};

export default connectStyle(ext('LargeListSkeletonPlaceholder'))(
  LargeListSkeletonPlaceholder,
);
