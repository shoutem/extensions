import React from 'react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { View } from '@shoutem/ui';
import { ext } from '../const';

function ProgressBar({ visible, progress, style }) {
  if (!visible) {
    return null;
  }

  return (
    <View style={style.container} styleName="horizontal v-center">
      <View
        numberOfLines={1}
        style={[style.progress, { width: `${progress}%` }]}
        styleName="bold"
      />
    </View>
  );
}

ProgressBar.propTypes = {
  visible: PropTypes.bool,
  style: PropTypes.object,
  progress: PropTypes.number,
};

export default connectStyle(ext('ProgressBar'))(ProgressBar);
